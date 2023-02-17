<?php
session_start();
include("config.php");
// unknown POST parameter sent, using json as filler //
$json = file_get_contents("php://input", true);
writeToFile("Start Time",time(),"w");
if(!function_exists('getallheaders'))
{
  function getallheaders()
  {
     $gaheaders = [];
     foreach($_SERVER as $name => $value)
     {
       if(substr($name, 0, 5) == 'HTTP_')
       {
         $gaheaders[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
       }
     }
     return $gaheaders;
  }
}
$allHeaders = getallheaders();
//writeToFile("Print Headers",print_r($allHeaders,1),"a+");

if(@$allHeaders["Content-Type"] != "application/json" || @$allHeaders["authorization"] != "afn9q3fqngqhfn0mqfughoih") // API code doesn't match and/or content-type doesn't match
{
  header("HTTP/1.1 401 Unauthorized");exit; // Throw a 401 Unauthorized
} 
writeToFile("Export Data: ",$json,"a+");

if($json)
{
    $array = json_decode($json,true); // false if you prefer objects

    $externalId = checkCA($array["visitorId"]);
	// Check SF for entry //
	if($externalId) {
        $chat = $array["chatTranscriptPlain"];
        $data = array(
            "Title" => "Chat Transcript Glia - ".date("d, F Y H:i:s",time()),
            "Body" => $chat,
            "ParentId" => $externalId
        );
        if($config["exportTranscriptAsNote"]) {
            createSF("Note",json_encode($data));
        }
        $answers = getAnswers($array["engagementId"]);
        $body = "";

        foreach($answers["answers"] as $a)
        {
            $body .= $a["title"]." : ".$a["answer"]." \n ";
        }
        $answerNote = array(
            "Title" => "Operator Notes & Survey - ".date("d, F Y H:i:s",time()),
            "Body" => $body,
            "ParentId" => $externalId
        );
        
        createSF("Note",json_encode($answerNote));
        exit;
	} else {
		writeToFile("External Id Did Not Exist",$externalId,"a+");
		exit;
	}

} else {
  header("HTTP/1.1 404 Not Found");exit;
}

function getAnswers($engagementId)
{
 	include("config.php");
	if($_SESSION["bearerToken"])
	{
		$bearer = $_SESSION["bearerToken"];
	} else {
		$bearer = getGliaBearer();
    }
    
    $url = "https://api.salemove.com/engagements/".$engagementId."/survey_answers/operator";
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_VERBOSE => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$bearer["token"],
            'Content-Type: application/json'
        )
    ));
    $return = curl_exec($ch);
    writeToFile("getAnswers --",$return,"a+");
    curl_close($ch);	
    
    $data = json_decode($return,true);
    writeToFile("getAnswers Array",print_r($data,1),"a+");
    if(isset($data))
    {
        return $data;
    } else {
        return false;
    }  

}

function checkCA($visitorId)
{
	include("config.php");
	if($_SESSION["bearerToken"])
	{
		$bearer = $_SESSION["bearerToken"];
	} else {
		$bearer = getGliaBearer();
	}
	
	$url = "https://api.salemove.com/sites/".$config["gliaSiteId"]."/visitors/".$visitorId;

    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_VERBOSE => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$bearer["token"],
            'Content-Type: application/json'
        )
    ));
    $return = curl_exec($ch);
    writeToFile("CheckCA --",$return,"a+");
    curl_close($ch);	
    
    $data = json_decode($return,1);
    writeToFile("CA Array",print_r($data,1),"a+");
    if(isset($data["custom_attributes"]["externalId"])) 
    {
        return $data["custom_attributes"]["externalId"];
    } else {
        return false;
    }  
}

function getGliaBearer()
{
	include("config.php");
	
	$gPost = array(
		"api_key_id" => $config["gliaKey"],
        "api_key_secret" => $config["gliaSecret"]
	);
	$url = "https://api.salemove.com/operator_authentication/tokens";
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($gPost),
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_VERBOSE => true,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Accept: application/vnd.salemove.v1+json'
        )
    ));
    $return = curl_exec($ch);
    
    $bearer = json_decode($return,true);
    curl_close($ch);
    //writeToFile("Return - Glia Key:",$return,"a+");
    //$bearer  = curlPost($url,json_encode($gPost),$gHeaders,true);
	$_SESSION["bearerToken"] = $bearer;
	//writeToFile("Glia Bearer: ",print_r($_SESSION["bearerToken"],1),"a+");
	return $bearer;
}


function createSF($table,$json)
{
	//curl https://yourInstance.salesforce.com/services/data/v53.0/sobjects/Account/ -H "Authorization: Bearer token" -H "Content-Type: application/json" -d "@newaccount.json"
    include("config.php");
	if($_SESSION["sfToken"])
	{
		$token = $_SESSION["sfToken"];
	} else {
		$token = getSFtoken();
	}
	$url = "https://".$config["url"].".my.salesforce.com/services/data/v53.0/sobjects/".$table;
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$token["access_token"],
            'Content-Type: application/json',
            'Accept: application/json'
        )
    ));

    $return = curl_exec($ch);
    writeToFile("CreateSF()",$return,"a+");
    curl_close($ch);
	return $return;
}

function checkSF($table,$where,$id)
{
	include("config.php");
	if($_SESSION["sfToken"])
	{
		$token = $_SESSION["sfToken"];
	} else {
		$token = getSFtoken();
	}

	$query_url = "https://".$config["url"].".my.salesforce.com/services/data/v53.0/query/?q=".urlencode("SELECT Id FROM ".$table." WHERE ".$where."='".$id."'");
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => $query_url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer '.$token["access_token"],
        )
    ));

    $return = curl_exec($ch);
    curl_close($ch);
	writeToFile("curl post return: ".$query_url,"\n Return: ".$return,"a+");

    $data = json_decode($return,true);
	if(isset($data))
	{
		return $data;
	} 
	else 
	{
		return false;
	}
}

function getSFtoken()
{
	include("config.php");
	if($_SESSION["sfToken"])
	{
		return $_SESSION["sfToken"];
	} else {		
		//curl https://MyDomainName.my.salesforce.com/services/oauth2/token -d 'grant_type=password' -d 'client_id=consumer-key' -d 'client_secret=consumer-secret' -d 'username=my-login@domain.com' -d 'password=my-password'

		$post_fields = array(
			"grant_type" => "password",
			"client_id" => $config["clientid"],
			"client_secret" => $config["clientsecret"],
			"username" => $config["sfUsername"],
			"password" => $config["sfPassword"]
		);

		$token_url = "https://".$config["url"].".my.salesforce.com/services/oauth2/token";

        $sfHeaders = array();
        $token_json = curlPost($token_url,$post_fields,$sfHeaders);
    
        $_SESSION["sfToken"] = json_decode($token_json,true);
        
        return json_decode($token_json,true);
	}
}

function curlPost($url,$post,$headers,$rheaders=false)
{
	if(isset($rheaders))
	{
        ob_start();
        $out = fopen('php://output', 'w');        
    }

    $ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, FALSE);

	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        
    if($rheaders)
    {
	    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    }
    if(isset($rheaders))
	{
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $out);    
    }

	if(isset($post))
	{
        curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	}
    $return = curl_exec($ch);
    fclose($out);
    $debug = ob_get_clean();

    writeToFile("debug info:",$debug,"a+");

    curl_close($ch);
	writeToFile("curl post return: ".$url,"\n Return: ".$return,"a+");
	return $return;
}

function curlGet($url,$headers,$rheaders=false)
{
	if(isset($rheaders))
	{
        ob_start();
        $out = fopen('php://output', 'w');        
    }

    $ch = curl_init();

	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

    if($rheaders)
    {
	    curl_setopt($ch, CURLOPT_HEADER, TRUE);
    }

    if(isset($rheaders))
	{
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_STDERR, $out);    
    }

    $return = curl_exec($ch);
    fclose($out);
    $debug = ob_get_clean();

    writeToFile("debug info:",$debug,"a+");

    curl_close($ch);
	writeToFile("curl post return: ".$url,"\n Return: ".$return,"a+");
	return $return;
}

function curlPatch($url,$post,$headers)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, FALSE);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
	if(isset($post))
	{
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	}
	if(isset($headers))
	{
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	}
	$return = curl_exec($ch);
	curl_close($ch);
	writeToFile("curl patch return: ".$url,"\n Return: ".$return,"a+");

}

function writeToFile($type,$data,$write)
{
	$fp = fopen("gliaend.txt",$write); 
	fwrite($fp,"---- ".$type." ----\n".$data."----\n");
	fclose($fp);
}
?>
<div>This page will close automatically</div>
<script>
  const queryParams = new URLSearchParams(window.location.hash.substr(1));
  const token = queryParams.get('access_token');
  window.opener.postMessage(JSON.stringify({type: 'AUTH_TOKEN', payload: token}), 'https://libs.glia.com');
</script>
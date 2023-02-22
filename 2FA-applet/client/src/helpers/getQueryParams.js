export default function getQueryParams() {
  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);

  return parameters;
}

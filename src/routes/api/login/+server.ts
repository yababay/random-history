import { YANDEX_CLIENT_ID, YANDEX_REDIRECT } from "$env/static/private"

const html = `
<!doctype html>
<html lang="ru">

<head>
<meta charSet="utf-8" />
<meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, shrink-to-fit=no, viewport-fit=cover'>
<meta http-equiv='X-UA-Compatible' content='ie=edge'>
<style>
   html,
   body {
      background: #eee;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 300px;
      border: 0;
      margin: 0;
      padding: 0;
      height: 100vh;
   } 
   body div {
         width: 100%;
         max-width: 30ch;
   }
</style>
<script src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"></script>
</head>

<body>
<main>
   <script>
   window.onload = function() {
      window.YaAuthSuggest.init({
                  client_id: '${YANDEX_CLIENT_ID}',
                  response_type: 'token',
                  redirect_uri: '${YANDEX_REDIRECT}'
               },
               'https://examplesite.com', {
                  view: 'button',
                  parentId: 'container',
                  buttonView: 'main',
                  buttonTheme: 'light',
                  buttonSize: 'm',
                  buttonBorderRadius: 0
               }
            )
            .then(function(result) {
               return result.handler()
            })
            .then(function(data) {
               console.log('Сообщение с токеном: ', data);
            })
            .catch(function(error) {
               console.log('Что-то пошло не так: ', error);
            });
      };
   </script>
</main>
</body>

</html>
`

export const GET = () => {
    return new Response(html, {headers: {'Content-Type': 'text/html'}})
}
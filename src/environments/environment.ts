// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebaseCredentials: {
    apiKey: 'AIzaSyB5U9LNxnybO6eAiVBBUHB1JuC0rLoIpXs',
    authDomain: 'opcloud-opl.firebaseapp.com',
    databaseURL: 'https://opcloud-opl.firebaseio.com',
    projectId: 'opcloud-opl',
    storageBucket: 'opcloud-opl.appspot.com',
    messagingSenderId: '553915308715'
  },
  firebaseAuthProviders: [
    'google'
  ],

};


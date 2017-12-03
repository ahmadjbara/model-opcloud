// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  firebaseCredentials: {
    apiKey: 'AIzaSyDCcM4LU4GtKEAUtpW-xjfL1Vq9G8K0J2w',
    authDomain: 'opcloud-client.firebaseapp.com',
    databaseURL: 'https://opcloud-client.firebaseio.com',
    projectId: 'opcloud-client',
    storageBucket: 'opcloud-client.appspot.com',
    messagingSenderId: '926349859368'
  },
  firebaseAuthProviders: [
    'google'
  ]
};

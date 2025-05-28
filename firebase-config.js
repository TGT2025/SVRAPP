const firebaseConfig = {
  apiKey: "AIzaSyA-nPIkD_Zbyy6IIeDFdAiCJlW8ZWulMuk",
  authDomain: "svr-app-84b9f.firebaseapp.com",
  projectId: "svr-app-84b9f",
  storageBucket: "svr-app-84b9f.firebasestorage.app", // Use exatamente este nome, igual ao bucket exibido no painel do Storage!
  messagingSenderId: "466245844914",
  appId: "1:466245844914:web:606dc88a28cb57bab16eab"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
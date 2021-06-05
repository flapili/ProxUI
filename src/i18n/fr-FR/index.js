export default {
  common: {
    language: "Langue",
    node: "Noeud",
  },
  form: {
    common: {
      rules: {
        thisFieldIsRequired: "Ce champ est requis"
      }
    },
    login: {
      errorMessage: "Mauvais nom d'utilisateur ou mot de passe",
      fields: {
        baseUrl: {
          label: "Url API Proxmox",
          hint: "L'Url vers l'API Proxmox",
        },
        username: {
          label: "Nom d'utilisateur",
          hint: "Nom d'utilisateur pour vous connecter",
        },
        password: {
          label: "Mot de passe",
          hint: "Mot de passe pour vous connecter",
        },
      },
      buttons: {
        login: {
          label: "Connexion",
        },
      },
    },
  },
}
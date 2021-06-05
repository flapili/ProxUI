export default {
  common: {
    language: "Language",
    node: "Node",
    VM: "VM",
    CT: "CT",
    createVM: "create @:common.VM",
    createCT: "create @:common.CT",
    bulk: "bulk",
    bulkStart: "@:common.bulk @:common.start",
    bulkStop: "@:common.bulk @:common.stop",
    bulkMigrate: "@:common.bulk @:common.migrate",
    shell: "shell",
    WOL: "wake on lan",
    start: "start",
    suspend: "suspend",
    resume: "resume",
    hibernate: "hibernate",
    shutdown: "shutdown",
    stop: "stop",
    reboot: "reboot",
    clone: "clone",
    migrate: "migrate",
    convertToTemplate: "convert to template",
    password: "password",
    logout: "logout",
    theme: "theme",
    template: "template",
  },
  notify: {
    requestSent: "The request has been sent successfully",
    // rebootVM: 'The @:common.VM "{vmId}" has been rebooted successfully',
    // resetVM: 'The @:common.VM "{vmId}" has been reseted successfully',
    // resumeVM: 'The @:common.VM "{vmId}" has been been resumed successfully',
    // shutdownVM: 'The @:common.VM "{vmId}" has ben shutdowned successfully',
    // startVM: 'The @:common.VM "{vmId}" has been started successfully on node "{nodeId}"',
    // stopVM: 'The @:common.VM "{vmId}" has been been stopped successfully',
    // suspendVM: 'The @:common.VM "{vmId}" has been been suspended successfully',
    // shutdownVM: 'The @:common.VM "{vmId}" has ben shutdowned successfully',
    // startCT: 'The @:common.CT "{vmId}" has been started successfully on node "{nodeId}"',
    // shutdownCT: 'The @:common.CT "{vmId}" has ben shutdowned successfully',
    // stopCT: 'The @:common.CT "{vmId}" has ben stopped successfully',
    passwordChanged: "The password has been changed",
    badCredentials: "Bad username or password",
  },
  form: {
    common: {
      rules: {
        thisFieldIsRequired: "This field is required"
      }
    },
    changePassword: {
      fields: {
        password: {
          label: "The new password",
          hint: "The new password",
        },
        passwordConfirm: {
          label: "The password again",
          hint: "confirm the password",
        },
      },
      rules: {
        minimalLength: "The password must be at least 5 characters long",
        passwordDoesNotMatch: "The password does not match",
      },
      buttons: {
        changePassword: {
          label: "Change password",
        },
      },
    },
    login: {
      fields: {
        baseUrl: {
          label: "Proxmox API Url",
          hint: "The Proxmox API Url",
        },
        username: {
          label: "User name",
          hint: "Your username to login",
        },
        password: {
          label: "Password",
          hint: "Your password to login",
        },
      },
      buttons: {
        login: {
          label: "Login",
        },
      },
    },
  },
}

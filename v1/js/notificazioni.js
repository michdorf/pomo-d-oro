function Notizie() {
  this.chiediPermesso = function askNotificationPermission() {
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log("This browser does not support notifications.");
    } else {
      if(checkNotificationPromise()) {
        Notification.requestPermission()
        .then((permission) => {
          eseguiSuPerm(permission);
        });
      } else {
        Notification.requestPermission(function(permission) {
          eseguiSuPerm(permission);
        });
      }
    }
  };

  var _suPermFunz = [];
  this.suPermesso = function suPermission(funz) {
    _suPermFunz.push(funz);
  };

  /* TODO:
    Hvis du beder om lov vha. banner eller knap, så kør:
    suPermission(function () {
        // Skjul banner .display = none$
    });
  */

  function eseguiSuPerm(permission) {
    if(!('permission' in Notification)) {
      Notification.permission = permission;
    }
    _suPermFunz.forEach((funz, i) => {
      funz(permission);
    });
  }

  this.verifica = function checkPermission() {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
        eseguiSuPerm(status);
      });
    }
  };

  this.mandi = function mandiNoti(titolo, text, actions, group_id) {
      function mandi(titolo, text, actions, group_id) {
        var img = '/to-do-notifications/img/icon-128.png';
        var options = {
          body: text/*,
          icon: img*/
        };
        if (typeof group_id !== "undefined") {
          options.tag = group_id;
        }
        if (typeof actions !== "undefined") {
          options.actions = actions; // f.eks. [{action: 'archive', title: 'Archive'}, {action:'extend', title:'Extend +5 minutter'}]
        }
        var notification = new Notification(titolo, options);

        // Du kan lave addEventListeners for "click", "close", "error", "show"
        notification.addEventListener("click", function (e) {notification.close()});

        return notification;
      }

      if (window.Notification && Notification.permission === "granted") {
        mandi(titolo, text, actions, group_id);
      }else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function (status) {
          eseguiSuPerm(status);

          if (status === "granted") {
            mandi(titolo, text, group_id);
          }
          else {
            alert(titolo + "\n" + text);
          }
        });
  }
};

function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }
}

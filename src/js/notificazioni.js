function Notizie() {
  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch (e) {
      return false;
    }

    return true;
  }

  const _suPermFunz = [];
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
    if (!("permission" in Notification)) {
      Notification.permission = permission;
    }
    _suPermFunz.forEach(funz => {
      funz(permission);
    });
  }

  this.chiediPermesso = function askNotificationPermission() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then(permission => {
          eseguiSuPerm(permission);
        });
      } else {
        Notification.requestPermission(function(permission) {
          eseguiSuPerm(permission);
        });
      }
    }
  };

  this.verifica = function checkPermission() {
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission(function(status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
        eseguiSuPerm(status);
      });
    }
  };

  this.mandi = function mandiNoti(titolo, text, actions, groupId) {
    function mandi(titolo, text, actions, groupId) {
      // var img = '/to-do-notifications/img/icon-128.png';
      const options = {
        body: text /*,
          icon: img*/
      };
      if (typeof groupId !== "undefined") {
        options.tag = groupId;
      }
      if (typeof actions !== "undefined") {
        options.actions = actions; // f.eks. [{action: 'archive', title: 'Archive'}, {action:'extend', title:'Extend +5 minutter'}]
      }
      const notification = new Notification(titolo, options);

      // Du kan lave addEventListeners for "click", "close", "error", "show"
      notification.addEventListener("click", function() {
        notification.close();
      });

      return notification;
    }

    if (window.Notification && Notification.permission === "granted") {
      mandi(titolo, text, actions, groupId);
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function(status) {
        eseguiSuPerm(status);

        if (status === "granted") {
          mandi(titolo, text, groupId);
        } else {
          alert(titolo + "\n" + text);
        }
      });
    }
  };
}

export default Notizie;

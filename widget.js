var lat, lng;
var address = '';
var pathAPI =
  'http://www.multitest.ua/api/v1/providers/provider-full/for_location/'
var urlGooglePlaces =
  'https://maps.googleapis.com/maps/api/js?callback=initializeAutocomplete&libraries=places';
var ipApi = 'http://ip-api.com/json';
var autocompleteOptions = {
  types: ['geocode'],
  componentRestrictions: {
    country: autocompleteCountyRestriction
  },
};
var helpText = 'Введи полный адрес, например: Киев, Николая Бажана просп. 32';

String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};

function initializeAutocomplete() {
  var autocompleteAddress = new google.maps.places.Autocomplete((document.getElementById(
    'address')), autocompleteOptions);
  google.maps.event.addListener(autocompleteAddress, 'place_changed', function() {
    try {
      var place = autocompleteAddress.getPlace();
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
      address = place.formatted_address;
      document.getElementById('widget-coverage').style.display =
        'none';
      WIDGET.Dialog.changeAddress('address');
    } catch (e) {

    } finally {

    }
  });
}

function loadWidget() {

  function runWidget() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = urlGooglePlaces;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName(
      'body')[0]).appendChild(script);

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'all';
    link.href = 'css/widget-provider.css';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName(
      'body')[0]).appendChild(link);
  }
  setTimeout(runWidget, 1000);

  WIDGET.Dialog.show({
    text: [{
      text: 'Введите полный адрес для проверки покрытия',
    }, {
      text: 'Покрытие есть!',
    }, {
      text: 'Покрытия нет :(',
    }],
    inputs: [{
      id: 'address',
      name: 'address',
      autocomplete: true,
      placeholder: 'например Киев, Николая Бажана просп. 32 и выберите его из выпадающего списка',
      className: '',
      callback: function(e) {
        var key = e.keyCode || e.which;
        if (key === 13) {
          WIDGET.Dialog.changeAddress('address');
          e.preventDefault();
        }
        return false;
      }
    }],
    buttons: [{
      id: 'widget-coverage',
      className: 'multitest--btn multitest--btn--primary',
      text: 'Проверить адрес',
      show: false,
      callback: function() {
        WIDGET.Dialog.coverage();
      }
    }, {
      id: 'widget-close',
      className: 'multitest--close',
      text: '',
      show: true,
      callback: function() {
        WIDGET.Dialog.hide()
      }
    }, {
      id: 'widget-new-check',
      className: 'multitest--btn multitest--btn--out',
      text: 'Ввести другой адрес',
      show: false,
      callback: function() {
        WIDGET.Dialog.newCheck();
      }
    }],
  });
}

window.onload = loadWidget;

if (typeof WIDGET == "undefined" || !WIDGET) {
  var WIDGET = {};
}

WIDGET.Lang = typeof WIDGET.Lang != 'undefined' && WIDGET.Lang ? WIDGET.Lang : {
  isUndefined: function(o) {
    return typeof o === 'undefined';
  },
  isString: function(o) {
    return typeof o === 'string';
  }
};

WIDGET.SVG = {
  svgns: 'http://www.w3.org/2000/svg',
  xlink: 'http://www.w3.org/1999/xlink',
  createElement: function(name, attrs) {
    var element = document.createElementNS(this.svgns, name);
    if (attrs) {
      this.setAttr(element, attrs);
    }
    return element;
  },
  setAttr: function(element, attrs) {
    for (var i in attrs) {
      if (i === 'href') {
        element.setAttributeNS(this.xlink, i, attrs[i]);
      } else {
        element.setAttribute(i, attrs[i]);
      }
    }
    return element;
  }
}


WIDGET.DOM = typeof WIDGET.DOM != 'undefined' && WIDGET.DOM ? WIDGET.DOM : {
  get: function(el) {
    return (el && el.nodeType) ? el : document.getElementById(el);
  },

  addCloseButton: function(parent) {
    var svgNS = "http://www.w3.org/2000/svg";

    var svg = WIDGET.SVG.createElement('svg', {
      width: "50",
      height: "50"
    });
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.className = "multitest--close";
    a.appendChild(svg);
    var circle = document.createElementNS(svgNS, "circle");
    circle.setAttributeNS(null, "cx", 25);
    circle.setAttributeNS(null, "cy", 25);
    circle.setAttributeNS(null, "r", 25);
    circle.setAttributeNS(null, "fill", "white");
    circle.setAttributeNS(null, "stroke", "black");
    circle.setAttributeNS(null, "stroke-width", 1);
    svg.appendChild(circle);
    var path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "d",
      "M12.5649712,12.2720779 L38.7279221,38.4350288");
    path.setAttributeNS(null, "stroke", "black");
    path.setAttributeNS(null, "stroke-width", 1);
    path.setAttributeNS(null, "fill", "none");
    svg.appendChild(path);
    var path = document.createElementNS(svgNS, "path");
    path.setAttributeNS(null, "d",
      "M38.2747971,11.6846001 L12.1118462,37.847551");
    path.setAttributeNS(null, "stroke", "black");
    path.setAttributeNS(null, "stroke-width", 1);
    path.setAttributeNS(null, "fill", "none");
    svg.appendChild(path);
    parent.appendChild(a);
  },

  addInput: function(className, parent, placeholder, id, className) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.className = className;
    input.placeholder = placeholder;
    input.className = className;
    parent.appendChild(input);
    return input;
  },

  addText: function(className, parent, text, tag) {
    var block = document.createElement(tag);
    block.className = className;
    var text = document.createTextNode(text);
    block.appendChild(text);
    parent.appendChild(block);
    return block;
  },

  addLink: function(className, parent, text, id, show) {
    var link = document.createElement("a");
    link.className = className;
    link.id = id;
    if (!show) {
      link.style.display = 'none';
    }
    link.setAttribute('href', "#");
    var text = document.createTextNode(text);
    link.appendChild(text);
    parent.appendChild(link);
    return link;
  },

  addListener: function(el, type, fn) {
    if (WIDGET.Lang.isString(el)) {
      el = this.get(el);
    }
    if (el.addEventListener) {
      el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, fn);
    } else {
      el['on' + type] = fn;
    }
  },

  removeListener: function(el, type, fn) {
    if (WIDGET.Lang.isString(el)) {
      el = this.get(el);
    }
    if (el.removeEventListener) {
      el.removeEventListener(type, fn, false);
    } else if (el.detachEvent) {
      el.detachEvent('on' + type, fn);
    } else {
      el['on' + type] = function() {
        return true;
      };
    }
  },
};
if (typeof WIDGET == "undefined" || !WIDGET) {
  var WIDGET = {};
}

WIDGET.Dialog = typeof WIDGET.Dialog != 'undefined' && WIDGET.Dialog ? WIDGET.Dialog :
  function() {
    var dialog = document.createElement('div');
    dialog.style.display = 'none';
    document.getElementById('widget-provider').appendChild(dialog);

    var loadJSON = function(path, success, error) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            if (success)
              success(JSON.parse(xhr.responseText));
          } else {
            if (error)
              error(xhr);
          }
        }
      };
      xhr.open("GET", path, true);
      xhr.send();
      return true;
    }

    var isHouse = function(results) {
      if (results.length == 0) {
        return false;
      }
      for (i = 0; i < results[0].address_components.length; i++) {
        for (j = 0; j < results[0].address_components[i].types.length; j++) {
          if (results[0].address_components[i].types[j] == "street_number") {
            return true;
          }
          if (results[0].address_components[i].types[j] == "street_address") {
            return true;
          }
          if (results[0].address_components[i].types[j] == "premise") {
            return true;
          }
          if (results[0].address_components[i].types[j] == "subpremise") {
            return true;
          }
        }
      }
      return false;
    };

    var render = function(o) {
      var html = '';
      loadJSON(ipApi,
        function(data) {
          lat = data.lat;
          lng = data.lon;
          var multitestWidget = document.createElement('div');
          multitestWidget.className =
            'multitest--widget activate--mt multitest--with--map';
          dialog.appendChild(multitestWidget);

          var multitestBackdrop = document.createElement('div');
          multitestBackdrop.className =
            'multitest--backdrop';
          multitestWidget.appendChild(multitestBackdrop);

          var multitestMapBox = document.createElement('div');
          multitestMapBox.className =
            'multitest--map--box';
          multitestWidget.appendChild(multitestMapBox);

          WIDGET.DOM.addLink(o.buttons[0].className, multitestMapBox, o.buttons[
              0]
            .text, o.buttons[0].id, false);

          var multitestContainer = document.createElement('div');
          multitestContainer.className =
            'multitest--container';
          multitestWidget.appendChild(multitestContainer);

          var multitestStep = document.createElement('div');
          multitestStep.id = 'step-main';
          multitestStep.className =
            'multitest--step multitest--step--check multitest--hideit';
          multitestContainer.appendChild(multitestStep);
          WIDGET.DOM.addText('multitest--title', multitestStep, o.text[0].text,
            'div');

          var multitestStepFrom = document.createElement('form');
          multitestStepFrom.id = 'multitest--check--address';
          multitestStep.appendChild(multitestStepFrom);
          WIDGET.DOM.addInput('', multitestStepFrom, o.inputs[0]
            .placeholder, o.inputs[0].id, o.inputs[0].className);
          activateListeners(o.inputs, 'keypress');

          var multitestStepCoverage = document.createElement('div');
          multitestStepCoverage.className =
            'multitest--step multitest--hideit';
          multitestStepCoverage.id = 'step-coverage';
          multitestContainer.appendChild(multitestStepCoverage);
          WIDGET.DOM.addText('multitest--title', multitestStepCoverage,
            o.text[1].text,
            'div');

          var multitestStepCoverage = document.createElement('div');
          multitestStepCoverage.className =
            'multitest--step multitest--hideit';
          multitestStepCoverage.id = 'step-coverage-empty';
          multitestContainer.appendChild(multitestStepCoverage);
          WIDGET.DOM.addText('multitest--title', multitestStepCoverage,
            o.text[2].text,
            'div');


          var multitestStepCoverageBtn = document.createElement('div');
          multitestStepCoverageBtn.className = 'multitest--btns';

          multitestStepCoverage.appendChild(multitestStepCoverageBtn);

          WIDGET.DOM.addLink(o.buttons[2].className,
            multitestStepCoverageBtn, o.buttons[
              2]
            .text, o.buttons[2].id, false);

          WIDGET.DOM.addCloseButton(WIDGET.DOM.addLink(o.buttons[1].className,
            multitestWidget, o.buttons[1]
            .text, o.buttons[1]
            .id, true));
          activateListeners(o.buttons, 'click');
          dialog.style.display = 'block';
        });
    };

    var activateListeners = function(tag, type) {

      var i, length, tag, isUndefined = WIDGET.Lang.isUndefined;

      if (WIDGET.Lang.isUndefined(tag)) {
        return;
      }

      length = tag.length;
      for (i = 0; i < length; i++) {
        item = tag[i];
        WIDGET.DOM.addListener(item.id, type, item.callback);
      }
    };

    return {
      show: function(o) {
        render(o);
      },
      hide: function() {
        dialog.style.display = 'none';
      },
      newCheck: function() {
        document.getElementById('step-main').className =
          'multitest--step multitest--hideit multitest--step--check';
        document.getElementById('step-coverage').className =
          'multitest--step multitest--hideit';
      },
      coverage: function() {
        document.getElementById('widget-coverage').style.display =
          'none';

        address = document.getElementById('address');
        address.className = "loading";

        loadJSON("{0}?lat={1}&lng={2}".format(pathAPI, lat, lng),
          function(data) {
            for (var i = 0; i < data.length; i++) {
              var ispData = data[i];
              if (ispIdArr.indexOf(ispData.id) != -1) {
                document.getElementById('step-main').className =
                  'multitest--step multitest--hideit';
                document.getElementById('step-coverage').className =
                  'multitest--step multitest--hideit multitest--step--check ';
                document.getElementById('step-coverage-empty').className =
                  'multitest--step multitest--hideit';
                address.className = "";
              }
            }
            document.getElementById('step-coverage').className =
              'multitest--step multitest--hideit';
            document.getElementById('step-main').className =
              'multitest--step multitest--hideit';
            document.getElementById('step-coverage-empty').className =
              'multitest--step multitest--hideit multitest--step--check ';
            address.className = "";
          });
      },
      changeAddress: function(result) {
        var address = document.getElementById('address').value;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: address
        }, function(results) {
          if (isHouse(results)) {
            document.getElementById('widget-coverage').style.display =
              'block';
            WIDGET.Dialog.coverage();
          } else {
            alert(helpText);
          }
        });
      }
    }
  }();

introJs().start();

function drawLabels() {
    sigma_instance.settings('drawLabels', true);
    sigma_instance.refresh();
}

function hideLabels() {
    sigma_instance.settings('drawLabels', false);
    sigma_instance.refresh();
}

function drawHideLabelsTrigger() {
    var checkBox = document.getElementById("drawHideLabelsCheckBox");
    if (checkBox.checked == true) {
        drawLabels();
    } else {
        hideLabels();
    }

}

function drawEdges() {
    sigma_instance.settings('drawEdges', true);
    sigma_instance.refresh();
}

function hideEdges() {
    sigma_instance.settings('drawEdges', false);
    sigma_instance.refresh();
}

function drawHideEdgesTrigger() {
    var checkBox = document.getElementById("drawHideEdgesCheckBox");
    if (checkBox.checked == true) {
        drawEdges();
    } else {
        hideEdges();
    }

}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

// Sigma settings: https://github.com/jacomyal/sigma.js/wiki/Settings

sigmaConfig = {
    renderer: {
        container: document.getElementById('container')
    },
    settings: {
        drawEdges: false,
        drawLabels: false,
        scalingMode: "inside",
        maxEdgeSize: 0.01,
        edgeColor: "source",
        labelThreshold: 3,
        defaultLabelColor: "#fff"
    }
}

sigmaInitCallback = function(s) {
    sigma_instance.refresh();
    document.getElementById('container').style.cursor = "pointer";
}

// initialize
var dataBaseUrl = "data/";
var nodeSelection = [];

document.getElementById('container').style.cursor = "wait";
var sigma_instance = new sigma(sigmaConfig);
sigma_instance.bind("doubleClickNode", function(e) {
    var len = nodeSelection.push(e.data.node.label);
    pages = "";
    nodeSelection.forEach(function(item, index, array) {
        pages += item;
        if (index != len - 1)
            pages += "|";
    });

    pvWin = window.open("https://tools.wmflabs.org/pageviews/?project=en.wikipedia.org&platform=all-access&agent=user" +
        "&range=latest-20" + "&pages=" + pages, "_blank");

});
sigma.parsers.json(dataBaseUrl + 'got.json', sigma_instance, sigmaInitCallback);

// Zoom out - single frame :
function zoomOut() {
    var c = sigma_instance.camera;
    c.goTo({
        ratio: c.ratio * c.settings('zoomingRatio')
    });
}

// Zoom in - single frame :
function zoomIn() {
    var c = sigma_instance.camera;
    c.goTo({
        ratio: c.ratio / c.settings('zoomingRatio')
    });
}

// Come back to initial zoom :
function initZoom() {
    var c = sigma_instance.camera;
    c.goTo({
        ratio: c.settings('zoomingRatio')
    });
}
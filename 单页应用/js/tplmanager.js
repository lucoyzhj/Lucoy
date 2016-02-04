define(function(require, exports) {
    var tplHash = {

    };

    function push(moduleId, html) {
        if (!moduleId) {
            return;
        }

        if (!tplHash[moduleId]) {
            return tplHash[moduleId] = html;
        }
    }

    function del(moduleId) {
        if (!moduleId || !tplHash[moduleId]) {
            return '';
        }

        delete tplHash[moduleId];
    }

    function update(moduleId, html) {
        if (!moduleId) {
            return;
        }

        return tplHash[moduleId] = html;
    }

    function get(moduleId) {
        if (!moduleId || !tplHash[moduleId]) {
            return '';
        }

        return tplHash[moduleId];
    }

    return {
        push: push,
        del: del,
        update: update,
        get: get
    };

});
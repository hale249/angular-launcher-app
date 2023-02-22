function makeTemplate(contents) {
    const div = document.createElement("div");
    const quill = new Quill(div);
    quill.setContents(contents);
    //console.log(div);
    return div.firstElementChild.innerHTML;
}

const templates = {}

function register(lang, content) {
    try {
        // console.log("content.........", content);
        let data = JSON.parse(content);
        templates[lang] = makeTemplate(data);
    } catch (e) {
        console.error(e);
    }
}

function Register(contents) {
    Object.keys(contents).forEach(lang => {
        register(lang, contents[lang]);
    });
}

function Get(lang) {
    return templates[lang] || templates['en'] || templates["__DEFAULT"];
}


(function() {
    //console.log("default ticket...........");
    let defaultTicket = __QMS.require_view("ticket/template/default_template");
    register("en", defaultTicket);
    register("__DEFAULT", defaultTicket);
})();

module.exports = {
    Register,
    Get
}
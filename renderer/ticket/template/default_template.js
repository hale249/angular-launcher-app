const defaultTicket = {
    "ops": [
        { "insert": "-" },
        {
            "attributes": { "align": "center", "header": 1 },
            "insert": "\n"
        },
        {
            "attributes": { "bold": true },
            "insert": "{{TICKET_NUMBER}}"
        },
        {
            "attributes": { "align": "center", "header": 1 },
            "insert": "\n"
        }, 
        {
            "attributes": { "bold": true },
            "insert": "{{SERVICE}}"
        }, 
        {
            "attributes": { "align": "center" },
            "insert": "\n"
        }, 
        {
            "insert": "Printed at: {{TIME}}"
        }, 
        {
            "attributes": { "align": "center" },
            "insert": "\n"
        }
    ]
};

module.exports = JSON.stringify(defaultTicket);
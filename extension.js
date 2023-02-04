const vscode            = require(`vscode`);
const { live_solve }    = require(`./nexsys-live-solver/pkg/nexsys_live_solver.js`);

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand("nexsys.Solve", () => {
            const panel = vscode.window.createWebviewPanel(
                "nexsys",
                "Nexsys Solution Window",
                vscode.ViewColumn.One,
                {}
            );

            var [soln, log, nil] = live_solve(vscode.window.activeTextEditor.document.getText())
                .split("<!---->");

            soln = `<h2>Solution:</h2>${soln}`; 
            log  = `<h2>Solution Steps:</h2>${log}`;
            nil  = `<h2>NIL Output:</h2>${nil.replace(/\n+/g, '<br>')}`;

            const logNil = `<table class="debug"><tr><td>${log}</td><td>${nil}</td><tr></table>`

            panel.webview.html = getWebviewContent(
                [soln, logNil].join('<br><hr>')
            );
        })
    );
}

function getWebviewContent(content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexsys Solution Window</title>
</head>
<style>
    table, tr, td { 
        border: 1px solid #5b5b5b; 
        border-collapse: collapse; 
        min-width: 150px;
    }
    .debug, .debug tr, .debug td{
        border: none;
        padding-right: 60px;
        vertical-align: top;
        overflow: clip;
    }
</style>
<body>
    <h1>[->] Nexsys Solver Results:</h1>
    ${content}
</body>
</html>`
}

module.exports = { activate }
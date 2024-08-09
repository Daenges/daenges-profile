registerCallOnLoad(() => addContentToScreen(`{{- partial "desktop/window/windowtemplate.html" (dict "title" "Error-404" "src" "/" "windowContent" (partial "404/404.html" . )) -}}`, "Error-404", "/"));


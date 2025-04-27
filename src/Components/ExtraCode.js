export  const convertHtmlToInternalFormat = (node) => {
      let result = "";
      for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          switch (child.tagName.toLowerCase()) {
            case "b":
            case "strong":
              result += `**${convertHtmlToInternalFormat(child)}**`;
              break;
            case "i":
            case "em":
              result += `_${convertHtmlToInternalFormat(child)}_`;
              break;
            case "u":
              result += `~~${convertHtmlToInternalFormat(child)}~~`;
              break;
            case "sup":
              result += `^${convertHtmlToInternalFormat(child)}^`;
              break;
            case "sub":
              result += `~${convertHtmlToInternalFormat(child)}~`;
              break;
            case "h1":
              result += `# ${convertHtmlToInternalFormat(child)}`;
              break;
            case "h2":
              result += `## ${convertHtmlToInternalFormat(child)}`;
              break;
            case "h3":
              result += `### ${convertHtmlToInternalFormat(child)}`;
              break;
            case "h4":
              result += `#### ${convertHtmlToInternalFormat(child)}`;
              break;
            case "h5":
              result += `##### ${convertHtmlToInternalFormat(child)}`;
              break;
            case "h6":
              result += `###### ${convertHtmlToInternalFormat(child)}`;
              break;
            case "span":
              if (child.style.color) {
                result += `{color:${child.style.color}}${convertHtmlToInternalFormat(child)}{/color}`;
              } else if (child.style.backgroundColor) {
                result += `{bgcolor:${child.style.backgroundColor}}${convertHtmlToInternalFormat(child)}{/bgcolor}`;
              } else if (child.style.fontFamily) {
                result += `{font:${child.style.fontFamily}}${convertHtmlToInternalFormat(child)}{/font}`;
              } else {
                result += convertHtmlToInternalFormat(child);
              }
              break;
            case "div":
              if (child.style.textAlign) {
                result += `{align:${child.style.textAlign}}${convertHtmlToInternalFormat(child)}{/align}`;
              } else {
                result += convertHtmlToInternalFormat(child);
              }
              break;
            default:
              result += convertHtmlToInternalFormat(child);
          }
        }
      }
      return result;
    };
  
export  const formatText = (text, widgets) => {
      let formatted = text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/_(.*?)_/g, "<i>$1</i>")
        .replace(/~~(.*?)~~/g, "<u>$1</u>")
        .replace(/~(.*?)~/g, "<sub>$1</sub>")
        .replace(/\^(.*?)\^/g, "<sup>$1</sup>")
        .replace(/\{highlight:(.*?)\}(.*?)\{\/highlight\}/g, '<mark style="background-color: $1; color: white;">$2</mark>')
        .replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>")
        .replace(/^\d+\. (.*)$/gm, "<li>$1</li>")
        .replace(/^- (.*)$/gm, "<li>$1</li>")
        .replace(/^###### (.*?)(?=\n|$)/gm, "<h6>$1</h6>")
        .replace(/^##### (.*?)(?=\n|$)/gm, "<h5>$1</h5>")
        .replace(/^#### (.*?)(?=\n|$)/gm, "<h4>$1</h4>")
        .replace(/^### (.*?)(?=\n|$)/gm, "<h3>$1</h3>")
        .replace(/^## (.*?)(?=\n|$)/gm, "<h2>$1</h2>")
        .replace(/^# (.*?)(?=\n|$)/gm, "<h1>$1</h1>")
        .replace(/\{color:(.*?)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>')
        .replace(/\{bgcolor:(.*?)\}(.*?)\{\/bgcolor\}/g, '<span style="background-color: $1; padding: 2px;">$2</span>')
        .replace(/\{align:(.*?)\}(.*?)\{\/align\}/g, '<div style="text-align: $1;">$2</div>')
        .replace(/\{font:(.*?)\}(.*?)\{\/font\}/g, '<span style="font-family: $1;">$2</span>')
        .replace(/\{icon:star\}/g, '<span class="icon-star">★</span>')
        .replace(/\{icon:heart\}/g, '<span class="icon-heart">♥</span>')
        .replace(/\{icon:check\}/g, '<span class="icon-check">✔</span>');
  
      let htmlParts = formatted.split(/(\{widget:.*?\})/g);
      let offset = 0;
      widgets.forEach((widget, index) => {
        const widgetMatch = `{widget:${widget.content}}`;
        const widgetIndex = htmlParts.join("").indexOf(widgetMatch, offset);
        if (widgetIndex !== -1) {
          const widgetHTML = `
            <div
              class="inline-widget"
              draggable="true"
              data-index="${index}"
              style="display: inline-block; background: lightblue; padding: 2px 5px; margin: 0 2px; position: relative; top: -2px;"
              ondragstart="event.dataTransfer.setData('text/plain', event.target.dataset.index)"
              ondblclick="event.target.contentEditable = true;"
            >${widget.content}</div>
          `;
          htmlParts.splice(widgetIndex / (offset + 1) + 1, 0, widgetHTML);
          offset = widgetIndex + widgetHTML.length;
        }
      });
  
      formatted = htmlParts.join("");
      if (formatted.includes("<li>")) {
        formatted = `<ul>${formatted}</ul>`;
      }
  
      return formatted;
    };
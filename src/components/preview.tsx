import { useRef, useEffect } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

const html = `
<html>
  <head>
    <style>html {background-color: white;}</style>
  </head>
  <body>
    <div id="root"></div>
  </body>
  <script>
    const handleError = (error) => {
      const root = document.querySelector("#root")
      root.innerHTML = "<div style='color:red;'><h4>Runtime Error</h4>" + error + "</div>"
    }
    window.addEventListener("error",event => {
      event.preventDefault()
      handleError(event.error)
    })
    window.addEventListener("message",event => {
      try {
        eval(event.data)
      }
      catch (error){
        handleError(error)
      }
    })
  </script>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
  }, [code]);

  const loadHandler = () => {
    iframe.current.contentWindow.postMessage(code, '*');
  };

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
        onLoad={loadHandler}
      />
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
    </div>
  );
};

export default Preview;

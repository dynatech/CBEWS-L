const Helpers = {

    httpRequest: (url, method, payload, headers) => {
        const config = {
            method,
            headers: {
            "Content-Type": "application/json"
            }
        };

        if (method.toLowerCase() === "post" &&  payload || payload.length > 0) {
            config.body = JSON.stringify(payload);
        }

        if (headers && typeof headers === "object" && Object.keys(headers).length > 0) {
            config.headers = headers;
        }

        return fetch(
            url,
            config
        ).then((response) => {
            if (response.ok) {
                let data = response;
                if (response.headers.get("Content-Type").indexOf("application/json") > -1) {
                    data = response.json();
                }
                return data;
            }
            return Promise.reject(response);
        });
    },

    downloadBlob: (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename || 'download';

        const clickHandler = () => {
            setTimeout(() => {
                URL.revokeObjectURL(url);
                this.removeEventListener('click', clickHandler);
            }, 150);
        };

        a.addEventListener('click', clickHandler, false);

        a.click();

        return a;
    }
  };

  export default Helpers;
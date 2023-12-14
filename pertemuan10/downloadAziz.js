// Legacy Code
function downloadAziz(url, callback) {
    // Simulating asynchronous download
    setTimeout(() => {
      const data = `${url} - File Content`;
      callback(null, data);
    }, 1000);
  }
  
  // Refaktor Callback ke Promise
  function downloadFileWithPromise(url) {
    return new Promise((resolve, reject) => {
      downloadAziz(url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  
  // Fitur download menggunakan Promise
  function downloadFile(url) {
    return new Promise((resolve, reject) => {
      downloadAziz(url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('Downloading...');
          resolve(data);
        }
      });
    });
  }
  
  // Async Await
  async function downloadAndProcessFile(url) {
    try {
      const fileData = await downloadFile(url);
      console.log('Processing file:', fileData);
      // Proses file di sini
      return 'File processed successfully';
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }
  
  // Contoh penggunaan
  const fileUrl = 'wa.apk';
  
  downloadFileWithPromise(fileUrl)
    .then((data) => {
      console.log('Downloaded file with Promise:', data);
    })
    .catch((error) => {
      console.error('Error downloading file with Promise:', error);
    });
  
  downloadFile(fileUrl)
    .then((data) => {
      console.log('Downloaded file:', data);
      return downloadAndProcessFile(fileUrl);
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
  
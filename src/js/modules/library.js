let errorLabel = document.getElementById('error');

// XMLHttpRequest //
export function getData(url) {
  return new Promise(function(resolve, reject) {
    //start request...
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
 // xhr.send(null);
    xhr.onload = () => {
      // so check the status
      if (xhr.status == 200) {
        // Resolve the promise with the response text
        resolve(xhr.response);
      }
      else {
        reject(Error(xhr.statusText));
      }
    };
    // Handle networkd errors
    xhr.onerror = () => {
      reject(Error("Error"));
    };
    // Make the request
    xhr.send();
  });
}

//Fades out and removes element from DOM
export function removeElement(element) {
  element.style.opacity = '0';
  setTimeout(function(){
    element.parentNode.removeChild(element);
  }, 1000);
}

//ERRORS...
export function displayError(element, message) {
  let errorLabel = document.getElementById('error');
  errorLabel.innerHTML = message;
  errorLabel.className += " errorIcon";

  window.setTimeout(function() {
    resetInput(element);
  }, 2000);
}
// Clears input value 
function resetInput(element) {
  //clears value
  element.value = '';
  //hides error Message
  hideError();
} 
// Hides error Message
export function hideError() {
  let errorLabel = document.getElementById('error');
  errorLabel.innerHTML ='';
  errorLabel.className = "errorMessage";
}




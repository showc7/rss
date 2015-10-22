import Requests from './components/requests.es'

function MainAppController(scope) {
   this.scope = scope;
   initilize();
}

MainAppController.prototype.initialize = function (first_argument) {
   this.scope.text = 'Hello world!';
};

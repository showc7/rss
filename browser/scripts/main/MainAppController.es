//import Requests from './components/requests.es'


class MainAppController {
   constructor ($scope) {
      console.log('ok');
      this.$scope = $scope;
      this.initalize();
   }

   initalize() {
      console.log('initializing');
      this.$scope.text = 'Hello world!';
   }
}

MainAppController.$inject = ['$scope'];
export { MainAppController }

 /* $scope.feed = 
   [ 
  		{ 
    		title: 'The Old Town of Pingyao', 
    		text: 'Pingyao is a small town in central Shanxi Province whose history goes back 2,700 years.',
    		pubdate: new Date('2004', '09', '14'), 
    		link: 'http://english.china.com/zh_cn/culture_history/heritages/11023762/20040914/11878201.html',
         likes: 0,
         dislikes: 0
  		}
	];
  $scope.plusOne=
    function(index) {
    	$scope.products[index].likes +=1;
  	};
  $scope.minusOne=
    function(index) {
    	$scope.products[index].dislikes +=1;
  	};*/
  	
  	

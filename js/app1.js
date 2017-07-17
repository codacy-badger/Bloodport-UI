var app=angular.module('main_app',['ui.router']);

app.config(function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise("/main_page");

	$stateProvider
		.state('main_page',{
			url: '/main_page',
			templateUrl: 'main_page.html'
		});
});
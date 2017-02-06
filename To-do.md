# Thought Work

 - Functionality
	 - 自适应屏幕
	 - 左边input栏，左下角list列表，右边显示地图
	 - 初始加载时，list要被填充，然后地图根据list的内容显示marker
	 - 按list其中的一项，或者直接点击地图上的marker，都要pop up一个**信息窗口**来显示额外的信息
	 - 左边的input栏用作filter，filter后，list的内容要马上更新，然后地图的marker数量也要同时更新
	 - 要用到除Google Maps以外的API，用Foursquare的API来填充额外信息窗口

 - A few outher key points to notice
	 - 所有的error都要处理
	 - API加载失败，界面要有提醒


 - Step by step working
	1. Make Google Map Work
function updatearray(val){
	removeall();
	var x=val;
	for(var i=0;i<x;i++)
	{
		var tag=document.createElement("div");
		tag.setAttribute("id","arr");
		tag.setAttribute("name","arr");
		var input=document.createElement("input");
		input.setAttribute("type","text");
		var num=Math.floor(Math.random()*9999);
		input.setAttribute("value",num);
		input.classList.add('ap');
		tag.appendChild(input);
		document.body.appendChild(tag);
	}
}
function removeall(){
	var a=document.getElementById("arr");
	while(a!=null){
		document.body.removeChild(a);
		a=document.getElementById("arr");
	}
	return;
}
function sleep(val)
{
	const date=Date.now();
	let currentDate=null;
	do{
		currentDate=Date.now();
	}while(currentDate-date<val);
}
function linearsearch()
{
	var number=document.getElementById("search").value;
	var range=document.getElementById("range").value;
	var arr=document.getElementsByClassName("ap");
	for(var i=0;i<range;i++)
	{
		sleep(100);
		arr[i].style.background="green";	
	}	

}
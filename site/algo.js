function updatearray(val)
{
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
function removeall()
{
	var a=document.getElementById("arr");
	while(a!=null)
	{
		document.body.removeChild(a);
		a=document.getElementById("arr");
	}
	return;
}
function declor()
{
	var range=document.getElementById("range").value;
	var arr=document.getElementsByClassName("ap");
	for(let i=0;i<range;i++)
	{
		arr[i].style.background="white";
	}
}
function linearsearch()
{
	declor();
	var number=document.getElementById("search").value;
	var range=document.getElementById("range").value;
	var arr=document.getElementsByClassName("ap");
	let count=1;
	for(let i=0;i<range;i++)
	{
		setTimeout(()=>{arr[i].style.background="green";setTimeout(()=>{arr[i].style.background="white"; if(arr[i].value==number) arr[i].style.background="green";},count*10)},count*100);
		count++;
		if(arr[i].value==number)
		{
			break;
		}
		if(i==range-1)
		{
			setTimeout(()=>{window.alert("Not Found");},count*1000);
		}		
	}	

}
function binarysearch()
{
	declor();
	var number=document.getElementById("search").value;
	var range=document.getElementById("range").value;
	var arr=document.getElementsByClassName("ap");
	for(var i=0;i<range;i++)
	{
		for(var j=0;j<range;j++)
		{
			if(parseInt(arr[j].value)>parseInt(arr[i].value))
			{
				var temp=arr[j].value;
				arr[j].value=arr[i].value;
				arr[i].value=temp;
			}
		}
	}
	for(let i=0;i<range;i++)
	{
		arr[i].innerHtml=arr[i];
	}
	var tage=document.createElement("p");
	var text=document.createTextNode("After Sorting.");
	tage.appendChild(text);
	tage.style.position="absolute";
	tage.style.bottom="500px";
	tage.style.fontSize="x-large";
	document.body.appendChild(tage);
	var l=0;
	var h=parseInt(range-1);
	let count=1;
	while(l<=h)
	{
		let m=parseInt((l+h)/2);
		setTimeout(()=>{arr[m].style.background="green"; setTimeout(()=>{arr[m].style.background="white"; if(arr[m].value==number) arr[m].style.background="green";},count*100)},count*1000);
		count++;
		if(parseInt(number)<parseInt(arr[m].value))
		{
			h=m-1;
		}
		else if(parseInt(number)>parseInt(arr[m].value))
		{
			l=m+1;
		}
		else
		{
			break;
		}
		if(l>h)
		{
			setTimeout(()=>{window.alert("Not Found");},count*1000);
			break;
		}
	}
}
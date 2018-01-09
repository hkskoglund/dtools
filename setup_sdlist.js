var myPercent = 1;
var waitCount = 0;
var timerId = null;

var sdlistKeyList = new Array(
  "setup_sdlist_rightTxt_0",1,
  "setup_sdlist_rightTxt_1",1,
  "setup_sdlist_rightTxt_2",1
  );

var g_SDInsert = parseInt(GV("1",0));
var g_SDLock = parseInt(GV("<%sdprotect%>",0));
var g_SDFormat = parseInt(GV("1",1));
var g_SDReady = ((g_SDInsert == 1) && (g_SDFormat == 1));

var g_thispath = GV("/video/20180101","");

g_thispath = (g_thispath == "\/") ? "" : g_thispath;

var g_uponepath = "";
if(g_thispath.lastIndexOf("\/") > 0)
{
  g_uponepath = g_thispath.substring(0,g_thispath.lastIndexOf("\/"));
}

var g_thispage = parseInt(GV("1",1));
//var g_thisfoldernum = parseInt(GV("<%sdthisfoldernum%>",0));
//var g_thisfilenum = parseInt(GV("<%sdthisfilenum%>",0));

var g_sdleft = parseFloat("42669056");
var g_used = parseFloat("19836992");

var g_fppname = GV("10;20;50;100","10;20;50");
var g_fpp = parseInt(GV("3",0));
var l_fppname = g_fppname.split(";");
//var g_totalpage = parseInt((g_thisfoldernum+g_thisfilenum-1)/(parseInt(l_fppname[g_fpp])));
//g_totalpage = (g_totalpage >= 1) ? (g_totalpage+1) : 1;
var g_totalpage = parseInt(GV("1",1));

//name;filetype;eventtype;size;numoffiles;property;operator;date;time;reserve
var g_folderslistStr = GV("00;1;0;null;50;0;0;1514795663;0,01;1;0;null;64;0;0;1514795663;0,02;1;0;null;52;0;0;1514795663;0,03;1;0;null;54;0;0;1514795663;0,04;1;0;null;64;0;0;1514795663;0,05;1;0;null;66;0;0;1514795663;0,06;1;0;null;64;0;0;1514795663;0,07;1;0;null;66;0;0;1514795663;0,08;1;0;null;40;0;0;1514795663;0,09;1;0;null;26;0;0;1514797149;0,10;1;0;null;6;0;0;1514800730;0,11;1;0;null;12;0;0;1514802582;0","");
var l_folders = g_folderslistStr.split(",");
//var g_filelistStr = "2000-01-01 00:00:00.jpg;Jpeg;Motion;15000;0;0;Admin;2000\\01\\01;00:00:00;Test File");
var g_filelistStr = decodeURIComponent(GV("",""));

var l_files = g_filelistStr.split(",");

var pageselect = new Ctrl_SelectNum("pageselect",1,g_totalpage,1,g_thispage,"","ChangePage()");
var delall = new Ctrl_Check("delall",0,"","FixStatus(\"All\")");

var o='';
o+='CTRLARY = {';

var count = 0;
for(var i=0;i<l_folders.length;i++)
{
  if(l_folders[i]=="" || l_folders[i]=="null")
    continue;

  eval('var del'+count+' = new Ctrl_Check("del'+count+'",0,"","FixStatus('+count+')");');
  var folderInfo1 = l_folders[i].split(";");
  o+='deltxt'+count+' : new Ctrl_Text("deltxt'+count+'","0","128","'+g_thispath+'\/'+folderInfo1[0]+'","sddel=",null,false,null,true),';
  count++;
}

for(var i=0;i<l_files.length;i++)
{
  if(l_files[i]=="" || l_files[i]=="null")
    continue;

  eval('var del'+count+' = new Ctrl_Check("del'+count+'",0,"","FixStatus('+count+')");');
  var fileInfo1 = l_files[i].split(";");
  o+='deltxt'+count+' : new Ctrl_Text("deltxt'+count+'","0","128","'+g_thispath+'\/'+fileInfo1[0]+'","sddel=",null,false,null,true),';
  count++;
}

o+='filesperpage : new Ctrl_Select("filesperpage",g_fppname,g_fpp,"sdfpp=")';
o+='};';
eval(o);


function MY_ONLOAD()
{
  FixStatus();
  g_lockLink = false;
};
function processopen()
{
//////Format Bar 20141211/////////////////////////////////////////
	$( "#progressFormatdialog" ).dialog({             
     modal: true,
     autoOpen: true,
     closeOnEscape: false,
     resizable: false, 
     open:function	(){
	 clearTimeout(timerId);
	 timerId = setTimeout("TimeLess()",1000);
	 },	 
 	 width: 250,
	 height: 100,     
	 title: GL("_SD_Format"),                                
	 overlay:{opacity: 0.7, background: "#FF8899" },
 	 close: function(event, ui) {}
  });                 

  $( "#progressFormatbar" ).progressbar({
     value: false,
	 change: function() {
		$( ".progress-label" ).text( $( "#progressFormatbar" ).progressbar( "value" ) + "%" );
	 },
	 complete: function() { }
	});
//////////////////////////////////////////////////////////////  
};

function FixStatus(index)
{
  for(var i=0;i<count;i++)
  {
    if(index == "All")
      eval('del'+i+'.SV(delall.GV());');

    eval('DisableObject("deltxt'+i+'",(del'+i+'.GV()==0 || g_SDLock==1));');
    eval('DisableObject("del'+i+'",(g_SDLock==1));');
  }

  DisableObject("delall",(g_SDLock==1));
  DisableObject("sdFormatBtn",(g_SDLock==1));
};


function SDMessageBlack()
{
  var o='';
  o+='<table align="center" width="500" border="0" cellpadding="1" cellspacing="1" ><tr>';
  o+='<td><center>'+GL((!g_SDReady) ? "setup_sdlist_unavailable" : "setup_sdlist_there_isnt")+'</center></td>';
  if(g_SDInsert == 1)
  {
    o+='</tr><tr>';
    o+='<td><br>'+GetButtonHtml("sdFormatBtn",GL("sd_format"),"SDCardFormat()")+'</td>';
	
    o+='</tr></table>';
	o+='<div id="progressFormatdialog"  style="display:none;">';                      
	o+='<div id="progressFormatbar" style="border:1px solid;margin:10px;"><div class="progress-label" style=" position: absolute;left: 50%;top: 20px;font-weight: bold;text-shadow: 1px 1px 0 #fff;"></div></div>';
	o+='</div>';

  }
  else
	o+='</tr></table>';
  return o;
};
function SDFolderFileBlack()
{
  var o='';
  o+='<table align="center" width="500" border="0" cellpadding="1" cellspacing="1" ><tr>';
  o+='<td width="200" colspan="2">'+GL("setup_sdlist")+': '+(g_thispath==""? '\/' : g_thispath)+'</td>';
  if(g_thispath=="")
    o+='<td align="right" >'+GL("sd_status")+' : '+((g_SDLock==1) ? GL("sd_write_protected") : GL("sd_ready"))+'</td>';
  else{
    if(g_supportnvrbased)
		o+='<td align="right" ><a href="javascript:ChangeContent(\'cgi-bin/sdoperate.cgi?list=&path='+g_uponepath+'&page=1\')" >'+GL("setup_sdlist_top_level")+'</a></td>';
	else
		o+='<td align="right" ><a href="javascript:ChangeContent(\'cgi-bin/sdlist.cgi?path='+g_uponepath+'&page=1\')" >'+GL("setup_sdlist_top_level")+'</a></td>';
  }	
  o+='</tr><tr>';
  
   if(g_supportnvrbased)
	o+='<td colspan="2">'+GL("setup_sdlist_fpp")+': '+WH_("filesperpage")+'&nbsp;&nbsp;<a href="javascript:ChangeContent(\'cgi-bin/sdoperate.cgi?list=&path='+g_thispath+'&page='+g_thispage+'\')" >'+GL("setup_sdlist_refresh")+'</a></td>';	
  else
	o+='<td colspan="2">'+GL("setup_sdlist_fpp")+': '+WH_("filesperpage")+'&nbsp;&nbsp;<a href="javascript:ChangeContent(\'cgi-bin/sdlist.cgi?path='+g_thispath+'&page='+g_thispage+'\')" >'+GL("setup_sdlist_refresh")+'</a></td>';
	
  o+='<td align="right" >'+pageselect.html+' of '+g_totalpage+'</td>';
  o+='</tr><tr>';
  o+='<td colspan="3" ><table align="center" style="background-color:#e6e8fa;" width="100%" border="1" cellpadding="1" cellspacing="1" ><tr>';
  o+='<td><strong>'+delall.html+'&nbsp;'+GL("_delete")+'</strong></td>';
  o+='<td><strong>'+GL("setup_sdlist_file")+'</strong></td>';
  o+='<td><strong>'+GL("setup_sdlist_files_num")+'</strong></td>';
  o+='<td><strong>'+GL("setup_sdlist_size")+'</strong></td>';

  var amount = 0;
  for(var i=0;i<l_folders.length;i++)
  {
    if(l_folders[i]=="" || l_folders[i]=="null")
      continue;

    var folderInfo = l_folders[i].split(";");
    o+='</tr><tr>';
    o+='<td align="center" >'+WH_("deltxt"+amount)+eval('del'+amount+'.html')+'</td>';
   if(g_supportnvrbased)
	o+='<td><a href="javascript:ChangeContent(\'cgi-bin/sdoperate.cgi?list=&path='+g_thispath+'\/'+folderInfo[0]+'&page=1\')" >'+folderInfo[0]+'</a></td>';
   else
    o+='<td><a href="javascript:ChangeContent(\'cgi-bin/sdlist.cgi?path='+g_thispath+'\/'+folderInfo[0]+'&page=1\')" >'+folderInfo[0]+'</a></td>';
   
    o+='<td>'+folderInfo[4]+'</td>';
	if(folderInfo[3] == "null" || folderInfo[3] == "")
	  o+='<td>&nbsp;</td>';
	else
      o+='<td>'+folderInfo[3]+'</td>';
    amount++;
  }

  for(var i=0;i<l_files.length;i++)
  {
    if(l_files[i]=="" || l_files[i]=="null")
      continue;

    var fileInfo = l_files[i].split(";");
    o+='</tr><tr>';
    o+='<td align="center" >'+WH_("deltxt"+amount)+eval('del'+amount+'.html')+'</td>';
    
    o+='<td><a href="cgi-bin/sddownload.cgi?file='+g_thispath+'\/'+fileInfo[0]+'" >';
	if(fileInfo[0].length >45)
	  o+=fileInfo[0].substring(0,45);
	else
	  o+=fileInfo[0];
	o+='</a></td>';
    o+='<td>&nbsp;</td>';
    o+='<td>'+fileInfo[3]+'</td>';
    amount++;
  }
  o+='</tr></table></td>';

  o+='</tr><tr>';
  if(g_thispath=="")
    o+='<td>'+GetButtonHtml("sdFormatBtn",GL("sd_format"),"SDCardFormat()")+'</td>';
  else
    o+='<td>&nbsp;</td>';
  o+='<td align="right" colspan="2">'+GL("setup_sdlist_toatl")+':'+(g_sdleft+g_used)+'KB, '+GL("setup_sdlist_used")+':'+g_used+'KB, '+GL("setup_sdlist_free")+':'+g_sdleft+'KB'+'</td>';
  o+='</tr><tr>';
  o+='<td></td><td width="100"></td><td></td>';//This line is used to force the separation of three columns.
  o+='</tr></table>';
  if(g_supportnvrbased)
	o+='<br><center>'+GetButtonHtml("saveBtn","&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;","Send_Nvrbaed_Sd()");
  else
	o+='<br><center>'+GetDLinkSubmitButton("okBtn","&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");

  o+='<div id="progressFormatdialog"  style="display:none;">';                      
  o+='<div id="progressFormatbar" style="border:1px solid;margin:10px;"><div class="progress-label" style=" position: absolute;left: 50%;top: 20px;font-weight: bold;text-shadow: 1px 1px 0 #fff;"></div></div>';
  o+='</div>';
  return o;
};
/*
function SDFolderListBlack()
{
  var o='';
  o+='<table align="center" width="500" border="0" cellpadding="1" cellspacing="1" ><tr>';
//  o+='<td colspan="3" >'+GL("setup_sdlist_records")+'</td>';
  o+='<td width="140" >'+GL("path_str")+': '+(g_thispath==""? '\/' : g_thispath)+'</td>';
  o+='<td>&nbsp;</td>';
  o+='<td align="right" >'+GL("sd_status")+' : '+((g_SDLock==1) ? GL("sd_write_protected") : GL("sd_ready"))+'</td>';

  o+='</tr><tr>';
  o+='<td colspan="3" ><table align="center" width="100%" border="1" cellpadding="1" cellspacing="1" ><tr>';
  o+='<td>'+GL("setup_sdlist_record_type")+'</td>';
  o+='<td>'+GL("setup_sdlist_files_num")+'</td>';
  o+='<td>'+GL("setup_sdlist_size")+'</td>';
  for(var i=0;i<l_folders.length;i++)
  {
    if(l_folders[i]=="" || l_folders[i]=="null")
      continue;

    var folderInfo = l_folders[i].split(";");
    o+='</tr><tr>';
    o+='<td><a href="javascript:ChangeContent(\'sdlist.htm?path='+g_thispath+'\/'+folderInfo[0]+'&page=1\')" >'+folderInfo[0]+'</a></td>';
    o+='<td>'+folderInfo[4]+'</td>';
    o+='<td>'+folderInfo[3]+'</td>';
  }
  o+='</tr></table></td>';
  o+='</tr><tr>';
  o+='<td>'+GetButtonHtml("sdFormatBtn",GL("sd_format"),"SDCardFormat()")+'</td>';
  o+='<td>&nbsp;</td>';
  o+='<td align="right" >'+GL("setup_sdlist_toatl")+':'+(g_sdleft+g_used)+'KB, '+GL("setup_sdlist_used")+':'+g_used+'KB, '+GL("setup_sdlist_free")+':'+g_sdleft+'KB'+'</td>';
  o+='</tr></table>';
  return o;
};
function SDFileListBlack()
{
  var o='';
  o+='<table align="center" width="500" border="0" cellpadding="1" cellspacing="1" ><tr>';
  o+='<td width="140" >'+GL("path_str")+': '+(g_thispath==""? '\/' : g_thispath)+'</td>';
  o+='<td>&nbsp;</td>';
  o+='<td align="right" ><a href="javascript:ChangeContent(\'sdlist.htm?path='+g_uponepath+'&page=1\')" >'+GL("setup_sdlist_top_level")+'</a></td>';

  o+='</tr><tr>';
  o+='<td>'+GL("setup_sdlist_fpp")+': '+WH_("filesperpage")+'</td>';
  o+='<td><a href="javascript:ChangeContent(\'sdlist.htm?path='+g_thispath+'&page='+g_thispage+'\')" >'+GL("setup_sdlist_refresh")+'</a></td>';
  o+='<td align="right" >'+pageselect.html+' of '+g_totalpage+'</td>';

  //if(g_filelistStr != "null" && g_filelistStr !="")
  {
    o+='</tr><tr>';
    o+='<td colspan="3" ><table align="center" width="100%" border="1" cellpadding="1" cellspacing="1" ><tr>';
    o+='<td>'+delall.html+'&nbsp;'+GL("_delete")+'</td>';
    o+='<td>'+GL("setup_sdlist_file")+'</td>';
    //o+='<td>'+GL("setup_sdlist_event_type")+'</td>';
    o+='<td>'+GL("setup_sdlist_size")+'</td>';
    for(var i=0;i<l_files.length;i++)
    {
      if(l_files[i]=="" || l_files[i]=="null")
        continue;

      var fileInfo = l_files[i].split(";");
      o+='</tr><tr>';
      o+='<td align="center" >'+WH_("deltxt"+i)+eval('del'+i+'.html')+'</td>';
      o+='<td><a href="sdlist.htm?file='+g_thispath+'\/'+fileInfo[0]+'" >'+fileInfo[0]+'</a></td>';
      //o+='<td>'+fileInfo[2]+'</td>';
      o+='<td>'+fileInfo[3]+'</td>';
    }
    o+='</tr></table></td>';
  }

  o+='</tr><tr>';
  o+='<td colspan="2" >&nbsp;</td>';
  o+='<td align="right" >'+GL("setup_sdlist_toatl")+':'+(g_sdleft+g_used)+'KB, '+GL("setup_sdlist_used")+':'+g_used+'KB, '+GL("setup_sdlist_free")+':'+g_sdleft+'KB'+'</td>';
  o+='</tr></table>';

  if(g_filelistStr != "null" && g_filelistStr !="")
    o+='<br><center>'+GetDLinkSubmitButton("okBtn","OK");

  return o;
};
*/


function Send_Nvrbaed_Sd()
{
	var o='/cgi-bin/sdoperate.cgi?';
	
	o+= CTRLARY['filesperpage'].setcmd + CTRLARY['filesperpage'].GV();
	
	
		o+="&del=";
		
		var count = 0;	
		var f_flag = false;
		for(var i=0;i<l_folders.length;i++)
		{
			if(l_folders[i]=="" || l_folders[i]=="null")
				continue;
		
			if( parseInt(eval('del'+count+'.GV()'), 10) >0)	{
				
				if( f_flag == false){
					o+=  CTRLARY['deltxt'+count].GV();
					f_flag = true;
				}	
				else
					o+= "," + CTRLARY['deltxt'+count].GV();
			}
				
		 
		  count++;
		}
			
			
		//var count = 0;	
		var f_flag = false; 
		for(var i=0;i<l_files.length;i++)
		{
			if(l_files[i]=="" || l_files[i]=="null")
				continue;
				
			if( parseInt(eval('del'+count+'.GV()'), 10) >0)	{
			
				if( f_flag == false){
					o+= CTRLARY['deltxt'+count].GV();
					f_flag = true;
				}	
				else
					o+= "," + CTRLARY['deltxt'+count].GV();
			}
				
		  count++;
		}
	
	
	SendHttp(o,false,callChange);
	
}

function callChange()
{
	if (g_SubmitHttp.readyState == 4)
	{
		if (g_SubmitHttp.status != 200)
		{
			alert(GL("err_submit_fail"));
			
			WS(GL("fail_"));
		}
		else 
		{
			WS(GL("ok_"));
			
			ChangePage();				
		}
	}
	
}

function MY_SUBMIT_OK()
{
	ChangeContent('cgi-bin/sdlist.cgi?path='+g_thispath+'&page='+pageselect.GV());
  
};
function PopupWaitPage(URL,id,x,y,w,h)
{
  var fullProps = "dialogLeft:"+x+"px;dialogTop:"+y+"px;dialogWidth:"+w+"px;dialogHeight:"+h+"px;";
  fullProps+="resizable:no;scrollbars:no;status:no";
  showModalDialog(URL,id,fullProps);
  //showModalDialog("testformat.htm",id,fullProps);
};

function SDCardFormat()
{
  isOK = confirm(GL("sdformatinfo"));
  if(isOK)
  {	 
		myPercent=0;
		waitCount=0;
		processopen();
		SendHttp('cgi-bin/format.cgi?SD',true)
      
		clearTimeout(timerId);
		timerId = setTimeout("TimeLess()",1000);
  }
};
function TimeLess()
{
  if(myPercent==100){
	clearTimeout(timerId);
	$( "#progressFormatdialog" ).dialog( "close" );
	$( "#progressFormatbar" ).progressbar( "value", false );
	
	if(g_supportnvrbased)
		ChangeContent('cgi-bin/sdoperate.cgi?list=',true);
	else
		ChangeContent('cgi-bin/sdlist.cgi',true);  
		
	var element = document.getElementById("progressFormatdialog");
	element.parentNode.removeChild(element);
  }
  else if(myPercent > 80 || waitCount > 0)
  {
    waitCount++; 
	myPercent++; 
	
	if(g_supportnvrbased)
		SendHttp("/cgi-bin/sdstatus.cgi",true,CheckFormatStatus);
	else
		SendHttp(c_iniUrl+"&getdlinksdstatus",true,CheckFormatStatus);
  }
  else
  { 
    myPercent++;
	
	if(g_supportnvrbased)
		SendHttp("/cgi-bin/sdstatus.cgi",true,CheckFormatStatus);
	else
		SendHttp(c_iniUrl+"&getdlinksdstatus",true,CheckFormatStatus);
  }	
};

function CheckFormatStatus()
{
  if (g_SubmitHttp.readyState==4 )
  {
    if ( g_SubmitHttp.status == 200)
    {
		 var txt = g_SubmitHttp.responseText;		
		 var vv = txt.split('=');

		 if (vv.length >= 2 )
		 {
				code2 = parseInt(vv[1],16);
				var sdinsert = ((code2 & 0x00000001) != 0);
				var sdlock = ((code2 & 0x00000002) != 0);
				var sdformat = ((code2 & 0x00000004) != 0);
				var sdtesting = ((code2 & 0x00000008) != 0);
				var sdformaterror = ((code2 & 0x00000020) != 0);
			
				if(sdformaterror)
				{ 
				  alert(GL("sdformaterror"));
				  $( "#progressFormatdialog" ).dialog( "close" );
				  $( "#progressFormatbar" ).progressbar( "value", false );
				}		
				if(sdtesting || !sdinsert || !sdformat || sdlock)
				{
					  if (myPercent < 100)
					  {
							if(myPercent > 80 || waitCount > 0)
							{
								  if(waitCount > 15)
								  {
									alert(GL("sdformaterror"));
									$( "#progressFormatdialog" ).dialog( "close" );
									$( "#progressFormatbar" ).progressbar( "value", false );
								  }
								  else
								  {
									$( "#progressFormatbar" ).progressbar( "value", parseInt(myPercent) );
									timerId = setTimeout("TimeLess()",3000);
								  }
							}
							else
							{
								$( "#progressFormatbar" ).progressbar( "value", parseInt(myPercent) );
								timerId = setTimeout("TimeLess()",300);
							}
					   }
				}
				else
				{
					myPercent=100;
					$("#progressFormatbar" ).progressbar( "value", parseInt(myPercent) );
					timerId = setTimeout("TimeLess()",300);
				}
		  }
		  else
		  {
			$( "#progressFormatdialog" ).dialog( "close" );
			$( "#progressFormatbar" ).progressbar( "value", false );
		  }
    }
  }
};

function ChangePage()
{ 

 if(g_supportnvrbased)
	ChangeContent('cgi-bin/sdoperate.cgi?list=&path='+g_thispath+'&page='+pageselect.GV());
 else
	ChangeContent('cgi-bin/sdlist.cgi?path='+g_thispath+'&page='+pageselect.GV());
};


DW(GetPageHead(MENU_ITEM_SETUP,ISETUP_SDLIST));
DW(GetDLinkOrangeBox(GL("setup_sdlist_orange_t"),GL("setup_sdlist_orange_str")));

if(!g_SDReady || ((g_folderslistStr=="null" || g_folderslistStr=="") && g_thispath=="" && (g_filelistStr == "null" || g_filelistStr =="")))
  DW(GetDLinkBlackBox(GL("setup_sdlist_black_t"),SDMessageBlack()));
else
  DW(GetDLinkBlackBox(GL("setup_sdlist_black_t"),SDFolderFileBlack()));
/*
else
  DW(GetDLinkBlackBox(GL("setup_sdlist_black_t"),SDFolderListBlack()));
if(((g_filelistStr != "null" && g_filelistStr !="") || ((g_folderslistStr=="null" || g_folderslistStr=="") && g_thispath!="" && (g_filelistStr == "null" || g_filelistStr ==""))) && g_SDReady)
  DW(GetDLinkBlackBox(GL("setup_sdlist_black_t"),SDFileListBlack()));
*/
DW(GetPageBottom(sdlistKeyList));
ALC();
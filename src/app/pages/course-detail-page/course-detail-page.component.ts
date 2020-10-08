import { Component, OnInit, ViewChild } from '@angular/core';
import { ContentService } from 'src/app/services/content.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

import { faFilePdf , faVideo, IconDefinition, faFileWord, faCogs, faPlay, faPlayCircle, faGlobe} from '@fortawesome/free-solid-svg-icons';
import { SubTopic } from 'src/app/models/sub-topic.model';
import { Content, Class } from 'src/app/models/content.model';
import { MatSidenav } from '@angular/material/sidenav';
import { CurrentUser } from 'src/app/models/user.model';

export interface CustomContent{
   data: Content;
   icon:IconDefinition;
}

@Component({
  selector: 'app-course-detail-page',
  templateUrl: './course-detail-page.component.html',
  styleUrls: ['./course-detail-page.component.scss']
})
export class CourseDetailPageComponent implements OnInit {

  public subTopic: SubTopic;

  public user: CurrentUser;
  public isUserLogged: boolean;
  
  public topicName;
  public subTopicName;
 
  public intermediaryContent: CustomContent[];
  public basicContent: CustomContent[];
  public advanceContent: CustomContent[];

  public languageFilter:string;
  public classFilter:string;
  public audienceFilter:string;
  
  
  public levels: string[];
  public languages: string[];
  public classes: string[];
  public iconType: string[];


  @ViewChild('drawer') sidenav: MatSidenav;
  
  constructor(private contentService :ContentService,private snackbar: MatSnackBar, 
    private activatedRoute: ActivatedRoute,
    public matDialog: MatDialog,
    public authService: AuthService) { 
    this.activatedRoute.params.subscribe((params: Params)=>{
      this.setDefaultPageState();
       
      this.authService.currentUser.subscribe( (user: CurrentUser) => {
        if(user != null) {
          this.user = user; 
          this.setPageforRegisteredUser();
        }
      });

      this.contentService.getSubTopicById(parseInt(params['id'])).subscribe(subTopic => {
        this.subTopic = subTopic;
        this.setBanner();
        this.setDefaultFilters()
        this.loadFilterValues();
        this.distributeContentByLevel();
      }); 
    });
  }

  setPageforRegisteredUser(){
      this.isUserLogged = true;
  }

  setDefaultPageState(){
    this.isUserLogged = false;

    this.topicName = "";
    this.subTopicName = "";
   
    this.intermediaryContent = [];
    this.basicContent = [];
    this.advanceContent = [];
  
    this.languageFilter = "English";
    this.classFilter = "All";
    this.audienceFilter = "student";
    
    this.levels = ['basic','intermediary','advanced'];
    this.languages = [];
    this.classes = [];
    this.iconType = ['scorm','pdf','youtube','word'];
  }

  setDefaultFilters(){
    this.languageFilter = "English";
    this.audienceFilter = "student";
    this.classFilter = "All";
  }

  ngOnInit(): void {
  }

  loadFilterValues(){
    let languages = new Set<string>();
    let classes = new Set<string>();
    let englishLanguagePresent = false;
    
    for(var content of this.subTopic.contents){
      languages.add(content.language);
      if(content.language == "English")
        englishLanguagePresent = true;
      for(var cls of content.classes)
        classes.add(cls.name);
    }

    if(!englishLanguagePresent){
      this.languageFilter = languages.values().next().value;
    }
    classes.add('All');

    this.languages = Array.from<string>(languages).sort();
    this.classes = Array.from<string>(classes).sort();
  }

  
  isEligibleAfterFiltering(content:Content){
    if(this.isUserLogged && content.audience == 'teacherExclusive')
      return true;
    if (content.audience != this.audienceFilter && content.audience != 'both')
      return false;  
    if (!this.isClassEligible(content.classes))
      return false;  
    if (content.language != this.languageFilter)
      return false;     

    return true;
  }

  isClassEligible(classes:Class[]):boolean{
    for(var cls of classes){
      if(cls.name == this.classFilter || this.classFilter == 'All')
        return true;
    }
    return false;
  }

  assignContentByLevel(content:Content){
    if(content.level == 'basic'){
      this.basicContent.push({data:content,icon:this.getIcon(content.type)});
    } else if(content.level == 'intermediary'){
      this.intermediaryContent.push({data:content,icon:this.getIcon(content.type)});
    } else{
      this.advanceContent.push({data:content,icon:this.getIcon(content.type)});
    }
  }

  distributeContentByLevel(){

    this.basicContent = [];
    this.intermediaryContent = [];
    this.advanceContent = [];

    let feedbacks:Content[] = [];

    for(var content of this.subTopic.contents){
      if(this.isFeedbackContent(content.type)){
        feedbacks.push(content);
      }else if(this.isEligibleAfterFiltering(content)){
        this.assignContentByLevel(content)
      }
    }

    for(var content of feedbacks){
      if(this.isEligibleAfterFiltering(content)){
        this.assignContentByLevel(content)
      }
    }
  }

  isFeedbackContent(type: string):boolean{
    if (type == "feedback"){
      return true;
    } else {
      return false;
    }
  }

  getContentByLevel(level:string):CustomContent[]{
    if(level == 'basic')
      return this.basicContent;
    else if(level == 'intermediary')
      return this.intermediaryContent;
    else  
      return this.advanceContent;
  }

  onClick(event: Event, content: Content){
    if(content == null) {
      this.snackbar.open("Data not present");
    } else {
      if(this.isUserLogged) {
        this.registerContentClick(this.user.user.id, content.id);
      }  
     
      let url = content.url;
      if(content.type=='word')
          url='https://docs.google.com/viewer?url='+content.url+'&embedded=true';
      this.loadDialogBox(url,content.name,content.type);
    } 
  }

  registerContentClick(teacherId, contentId) {
    this.contentService.registerContentView(teacherId,contentId);
  }

  getIcon(type:string): IconDefinition{
    if (type == "scorm"){
      return faPlayCircle
    }
    if (type == "pdf"){
      return faFilePdf
    } 
    if (type == "youtube"){
      return faVideo
    } 
    if (type == "word"){
      return faFileWord
    }
    if (type == "feedback"){
      return faGlobe
    } 
  }

  loadDialogBox(link: String, desc: String, item: String) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = 'myapp-no-padding-dialog';

    dialogConfig.data = {
      url: link,
      title: desc,
      type: item 
    };
    
    this.matDialog.open(DialogBoxComponent, dialogConfig);
    
  }

  onNavBarOpen(){
    document.getElementById('mobile-nav-panel').style.height = '45vh';
    this.sidenav.toggle();
  }

  onNavBarClose(){
    document.getElementById('mobile-nav-panel').style.height = 'fit-content';
    this.sidenav.toggle();
  }

  setBanner(){
    this.topicName = this.subTopic.topic.name;
    this.subTopicName = this.subTopic.name;
    if(this.subTopic.image.formats.large != null) {
      (<HTMLImageElement>document.getElementById("bannerImage")).src = this.subTopic.image.formats.large.url;
    }else if(this.subTopic.image.formats.medium != null) {
      (<HTMLImageElement>document.getElementById("bannerImage")).src = this.subTopic.image.formats.medium.url;
    }else if(this.subTopic.image.formats.small != null) {
      (<HTMLImageElement>document.getElementById("bannerImage")).src = this.subTopic.image.formats.small.url;
    } else {
      (<HTMLImageElement>document.getElementById("bannerImage")).src = "/assets/images/placeholder.png";
    }
  }
}

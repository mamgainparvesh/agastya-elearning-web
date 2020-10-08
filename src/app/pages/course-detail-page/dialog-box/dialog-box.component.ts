import { Component, OnInit, Inject } from '@angular/core';
import { CourseDetailPageComponent } from '../course-detail-page.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {

  public url: SafeResourceUrl;
  public title: String;

  params = `toolbar=no,menubar=no,width=`+ 0.8*screen.availWidth +`,height=`+ 0.8*screen.availHeight+
           `,top=` + 0.1*screen.availHeight + `,left=` + 0.1*screen.availWidth ;

  constructor(private dialogRef: MatDialogRef<CourseDetailPageComponent>,
    @Inject(MAT_DIALOG_DATA) data, private _sanitizer: DomSanitizer) { 
      this.url = this._sanitizer.bypassSecurityTrustResourceUrl(data.url);
      this.title = data.title;

      if(data.type == 'scorm'){
        this.dialogRef.close();
        window.open(data.url, "_blank,",this.params);
      } else if(data.type == 'feedback'){
        this.dialogRef.close();
        window.open(data.url, "_blank,",this.params);
      }

     
    }

  ngOnInit(): void {
    
  }

  close(event: Event) {
    this.dialogRef.close();
  }

}

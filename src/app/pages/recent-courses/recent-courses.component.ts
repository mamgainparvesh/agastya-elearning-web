import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Course } from '../../models/course.model';
import { SubTopic } from '../../models/sub-topic.model';

@Component({
  selector: 'recent-courses',
  templateUrl: './recent-courses.component.html',
  styleUrls: ['./recent-courses.component.scss'],
})
export class RecentCoursesComponent implements OnInit {
  @Input()
  vh: number;

  public subTopics: SubTopic[];
  public course1: SubTopic;
  public course2: SubTopic;
  public course3: SubTopic;
  public restOfTheCourses: SubTopic[];
  public restOfTheCoursesPlaceholder: Array<any> = new Array(6);
  public restOfTheCoursesMobile: SubTopic[];

  constructor(private contentService: ContentService) {}

  slice(str: string, len: number = 25) {
    return str.length > len ? str.slice(0, len + 1) + '..' : str;
  }

  ngOnInit() {
    this.restOfTheCoursesPlaceholder.fill(1);

    this.contentService.getRecentSubTopic().subscribe((data: any) => {
      if (data) {
        this.subTopics = data;

        if (this.subTopics.length > 10) {
          this.subTopics = this.subTopics.slice(0, 10);
        } else {
          this.subTopics = this.subTopics.slice(0, this.subTopics.length);
          this.subTopics.reverse;
          let countForFillPending = 10 - this.subTopics.length;
          for (let i = 0; i < countForFillPending; i++) {
            this.subTopics.push(this.subTopics[0]);
          }
        }

        // Reset the Description
        this.subTopics.map((data) => {
          data.description = data.name;
        });

        //Get Top 3 Courses
        this.course1 = this.subTopics[0];
        this.course2 = this.subTopics[1];
        this.course3 = this.subTopics[2];

        //Courses for rest of the page & mobile
        this.restOfTheCourses = this.subTopics.slice(3, 9);
        this.restOfTheCoursesMobile = this.subTopics.slice(0, 6);

        //Rest of the courses
        this.restOfTheCourses.map((data) => {
          if (data.topic && data.topic.name) {
            data.name = data.topic.categories[0].name + ' - ' + data.topic.name;
          }
        });

        //Course 1
        if (this.course1.topic && this.course1.topic.name) {
          this.course1.name = this.course1.topic.categories[0].name + ' - ' + this.course1.topic.name;  
        }

        //Course 2
        if (this.course2.topic && this.course2.topic.name) {
          this.course2.name = this.course2.topic.categories[0].name + ' - ' + this.course2.topic.name;
        }

        //Course 3
        if (this.course3.topic && this.course3.topic.name) {
          this.course3.name = this.course3.topic.categories[0].name + ' - ' + this.course3.topic.name;  
        }
      }
    });
  }

  //course1.image?.formats.large.url
  imageFallBackMechanism(course: SubTopic, imageType: string) {
    if (course && course.image && course.image.formats) {
      if (imageType == 'large') {
        if (
          course.image.formats.large &&
          course.image.formats.large.url &&
          course.image.formats.large.url.trim() != ''
        ) {
          return course.image.formats.large.url;
        } else if (
          course.image.formats.medium &&
          course.image.formats.medium.url &&
          course.image.formats.medium.url.trim() != ''
        ) {
          return course.image.formats.medium.url;
        } else if (
          course.image.formats.small &&
          course.image.formats.small.url &&
          course.image.formats.small.url.trim() != ''
        ) {
          return course.image.formats.small.url;
        } else if (
          course.image.formats.thumbnail &&
          course.image.formats.thumbnail.url &&
          course.image.formats.thumbnail.url.trim() != ''
        ) {
          return course.image.formats.thumbnail.url;
        } else {
          return 'assets/images/placeholder.png';
        }
      } else if (imageType == 'small') {
        if (
          course.image.formats.small &&
          course.image.formats.small.url &&
          course.image.formats.small.url.trim() != ''
        ) {
          return course.image.formats.small.url;
        } else if (
          course.image.formats.thumbnail &&
          course.image.formats.thumbnail.url &&
          course.image.formats.thumbnail.url.trim() != ''
        ) {
          return course.image.formats.thumbnail.url;
        } else {
          return 'assets/images/placeholder.png';
        }
      } else if (imageType == 'thumbnail') {
        if (
          course.image.formats.thumbnail &&
          course.image.formats.thumbnail.url &&
          course.image.formats.thumbnail.url.trim() != ''
        ) {
          return course.image.formats.thumbnail.url;
        } else {
          return 'assets/images/placeholder.png';
        }
      } else {
        return 'assets/images/placeholder.png';
      }
    } else {
      return 'assets/images/placeholder.png';
    }
  }
}

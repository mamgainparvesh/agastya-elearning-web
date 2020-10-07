import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CONSTANTS from '../constants';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';
import { SubTopic } from '../models/sub-topic.model';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  showOverlay = true;
  constructor(private httpClient: HttpClient) {}

  getRecentSubTopic() {
    return this.httpClient.get(
      CONSTANTS.CONTENT_SERVICE_URL + 'sub-topics?_sort=created_at:DESC&_limit=10'
    );
  }

  getFeaturedSubTopic() {
    return this.httpClient.get(
      CONSTANTS.CONTENT_SERVICE_URL + 'featured-sub-topics'
    );
  }

  getTopicById(id): Observable<Topic> {
    return this.httpClient.get<Topic>(
      CONSTANTS.CONTENT_SERVICE_URL + 'topics' + `/${id}`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(
      CONSTANTS.CONTENT_SERVICE_URL + 'categories?_sort=name'
    );
  }

  searchCategories(search: string): Observable<Category[]> {
    return this.httpClient.get<Category[]>(
      CONSTANTS.CONTENT_SERVICE_URL +
        'categories' +
        `?title_contains=${search}&categoryDescription_contains=${search}`
    );
  }

  getSubTopicById(id: number) {
    return this.httpClient.get<SubTopic>(
      CONSTANTS.CONTENT_SERVICE_URL + 'sub-topics' + `/${id}`
    );
  }

  getCoursesByCategory(category: Category) {
    return this.httpClient.get<Course[]>(
      CONSTANTS.CONTENT_SERVICE_URL + 'courses' + `?category.id=${category.id}`
    );
  }

  searchCourses(search: string): Observable<Course[]> {
    return this.httpClient.get<Course[]>(
      CONSTANTS.CONTENT_SERVICE_URL +
        'courses' +
        `?title_contains=${search}&courseDescription_contains=${search}`
    );
  }

  getLessons(course: Course): Observable<Lesson[]> {
    return this.httpClient.get<Lesson[]>(
      CONSTANTS.CONTENT_SERVICE_URL + 'lessons' + `?course.id=${course.id}`
    );
  }

  registerContentView(teacher, content) {
    this.httpClient
      .post<any>(CONSTANTS.CONTENT_SERVICE_URL + 'teacher-contents', {
        teacher,
        content
    }).subscribe();
  }
}

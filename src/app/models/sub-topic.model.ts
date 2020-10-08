import { Media } from './media.model';
import { Topic } from './topic.model';
import { Content } from './content.model';

export interface SubTopic {
  id: number;
  name: string;
  description?: string;
  topic: Topic;
  created_at: Date;
  updated_at: Date;
  image: Media;
  contents: Content[];
  views: number;
  anyNormalContent: boolean;
  anyExclusiveContent: boolean;
}

import { UserInterface } from 'interfaces/user';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface FeedbackInterface {
  id?: string;
  customer_id: string;
  restaurant_id: string;
  rating: number;
  review?: string;
  created_at: Date;

  user?: UserInterface;
  restaurant?: RestaurantInterface;
  _count?: {};
}

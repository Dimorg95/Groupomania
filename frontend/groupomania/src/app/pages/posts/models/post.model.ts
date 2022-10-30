export class Post {
  _id!: string;
  userId!: string;
  title!: string;
  text!: string;
  imageUrl!: string;
  createdDate!: Date | string;
  likes!: number;
  usersLiked!: [string];
}

//Model des posts

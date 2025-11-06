import mongoose, { Document, Types, Schema, Model, Query } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IComment extends Document {
  user: Types.ObjectId | IUser;
  text: string;
  name?: string;
  avatar?: string;
  date: Date;
}

export interface IPost extends Document {
  content: string;
  user: Types.ObjectId | IUser;
  project: Types.ObjectId | IProject;
  likes: Types.Array<Types.ObjectId>;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  updateCommentUserInfo: (userId: string, updateData: { name?: string; avatar?: string }) => Promise<void>;
}

interface IPostModel extends Model<IPost> {
  // Add any static methods here if needed
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Comment cannot be more than 2000 characters']
    },
    name: String,
    avatar: String,
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true, timestamps: true }
);

const postSchema = new Schema<IPost, IPostModel>(
  {
    content: {
      type: String,
      required: [true, 'Please add some content'],
      trim: true,
      maxlength: [5000, 'Post cannot be more than 5000 characters']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [commentSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create a compound index for better query performance
postSchema.index({ user: 1, project: 1, createdAt: -1 });

// Populate user and project when finding posts
postSchema.pre<Query<IPost[], IPost>>(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name avatar'
  }).populate({
    path: 'project',
    select: 'title'
  });
  next();
});

// Update comment user info when a user updates their profile
postSchema.methods.updateCommentUserInfo = async function(
  userId: string, 
  updateData: { name?: string; avatar?: string }
): Promise<void> {
  const comments = this.comments as IComment[];
  
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const commentUser = comment.user as IUser;
    
    // Handle both populated and non-populated user
    const commentUserId = typeof commentUser === 'object' && commentUser !== null && '_id' in commentUser
      ? (commentUser as any)._id?.toString()
      : commentUser?.toString();
    
    if (commentUserId === userId) {
      const updatedComment = {
        ...comment.toObject(),
        name: updateData.name || (comment as any).name,
        avatar: updateData.avatar || (comment as any).avatar
      };
      
      this.comments.set(i, updatedComment);
    }
  }
  
  await this.save();
};

const Post = mongoose.model<IPost, IPostModel>('Post', postSchema);

export default Post;

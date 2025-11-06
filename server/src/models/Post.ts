import mongoose, { Document, Types, Schema, Model, Query, HydratedDocument, ObjectId } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

type UserRef = Types.ObjectId | IUser | string;

// Base interface for Comment document
export interface ICommentBase {
  user: UserRef;
  text: string;
  name?: string;
  avatar?: string;
  date: Date;
}

declare global {
  namespace Models {
    const User: Model<IUser>;
    const Project: Model<IProject>;
  }
}

// Helper type to safely extract ID from user reference
type ExtractId<T> = T extends { _id: any } ? T['_id'] : T extends ObjectId ? T : string;

// Base interface for Post document
export interface IPostBase {
  content: string;
  user: Types.ObjectId | IUser;
  project: Types.ObjectId | IProject;
  likes: Types.Array<Types.ObjectId>;
  comments: ICommentBase[];
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  avatar?: string;
}

// Mongoose document with methods
export interface IComment extends ICommentBase, Document {}

// Full Post interface with methods
export interface IPost extends IPostBase, Document {
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
  (this as Query<IPost[], IPost>)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'project',
      select: 'title'
    });
  next();
});

// Update comment user info when a user updates their profile
postSchema.methods.updateCommentUserInfo = async function(
  this: HydratedDocument<IPost>,
  userId: string, 
  updateData: { name?: string; avatar?: string }
): Promise<void> {
  // Create a new array to avoid direct mutation
  const updatedComments = this.comments.map(comment => {
    const commentUser = comment.user;
    
    // Helper function to extract ID from user reference
    const getUserId = (user: UserRef): string | null => {
      if (!user) return null;
      if (user instanceof Types.ObjectId) return user.toString();
      if (typeof user === 'string') return user;
      return user._id?.toString() || null;
    };
    
    const commentUserId = getUserId(commentUser);
    
    if (commentUserId === userId) {
      // Create a new comment object with updated fields
      const commentDoc = comment as unknown as Document & ICommentBase;
      const commentData = typeof commentDoc.toObject === 'function' 
        ? commentDoc.toObject() 
        : { ...comment };
      
      return {
        ...commentData,
        name: updateData.name ?? commentData.name,
        avatar: updateData.avatar ?? commentData.avatar
      } as unknown as IComment;
    }
    
    return comment;
  });
  
  // Use $set to update the comments array
  this.set('comments', updatedComments);
  await this.save();
};

// Create the model with simplified type parameters
const Post = mongoose.model<IPost>('Post', postSchema) as IPostModel;

export default Post;

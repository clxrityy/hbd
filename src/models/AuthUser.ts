import { model, Schema } from 'mongoose';

const authUserSchema = new Schema({
    UserID: String,
    AccessToken: String,
    RefreshToken: String,
});

export default model('AuthUser', authUserSchema);
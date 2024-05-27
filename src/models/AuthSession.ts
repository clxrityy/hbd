import { model, Schema } from 'mongoose';

const authSessionSchema = new Schema({
    SessionID: String,
    ExpiresAt: Date,
    Data: String,
});

export default model('AuthSession', authSessionSchema);
import { createParamDecorator } from 'routing-controllers';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../app.config';
import { Authorizer } from '../model/AuthorizerRes';

export function checkPermission(roles?: string[]) {
    return createParamDecorator({
        required: true,
        value: action => {
            try {
                const token = action.request.headers['token'];
                const decoded = jwt.verify(token, SECRET);
                if (!decoded.user) {
                    return new Authorizer(false, null);
                }
                const role = decoded.user.role.role;
                if (!roles.includes(role)) {
                    return new Authorizer(false, decoded.user);
                }
                return new Authorizer(true, decoded.user);
            } catch (err) {
                console.log(err);
                
                return new Authorizer(false, null);
            }
        }
    });
}
import { createParamDecorator } from 'routing-controllers';
import { verify } from 'jsonwebtoken';
import { SECRET } from '../app.config';
import { Authorizer } from '../model/AuthorizerRes';
import { RoleRepository } from '../repository/v1.0/RoleRepository';

export function checkPermission(roles?: string[]) {
    return createParamDecorator({
        required: true,
        value: async action => {
            try {
                const token = action.request.headers['token'];                
                const decoded = verify(token, SECRET);
                const roleInstance = RoleRepository.getInstance();

                if (!decoded.user) {
                    return new Authorizer(false, null);
                }

                const role = await roleInstance.getRoleByUserId(decoded.user.id);

                if (!roles.includes(role.role)) {
                    return new Authorizer(false, decoded.user);
                }
                
                return new Authorizer(true, decoded.user);
            } catch (err) {           
                return new Authorizer(false, null);
            }
        }
    });
}
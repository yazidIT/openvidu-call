import { NextFunction, Request, Response } from 'express';
const timingSafeEqual = require('crypto').timingSafeEqual;

import { compare } from 'bcryptjs';
import User from '../models/user.model';
import { CALL_PRIVATE_ACCESS } from '../config';

export class AuthService {
	adminSessions: Map<string, { expires: number }> = new Map();
	ADMIN_COOKIE_NAME = 'ovCallAdminToken';

	protected static instance: AuthService;

	private constructor() {}

	static getInstance() {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	authorizer = async (req: Request, res: Response, next: NextFunction) => {
		if (CALL_PRIVATE_ACCESS === 'ENABLED') {
			const userAuth = req.headers.authorization;
			const auth = Buffer.from(userAuth.split(' ')[1], 'base64').toString('ascii').split(':');
			const user = auth[0];
			const pass = auth[1];
	
			try {
				let data = await User.findOne( { userid: user }).exec();
	
				if(data == null) {
					console.log('User does not exist');
					return res.status(401).send('Unauthorized');
				}
				const validAuth = await this.checkPassword(pass, data.password);
	
				if(validAuth) {
					next();
				} else {
					return res.status(401).send('Unauthorized');
				}
			} catch (err) {
				return res.status(500).send('Exception');
			}
	} else {
		next();
	}
};

	isAdminSessionValid(sessionId: string): boolean {
		if(!sessionId) return false;

		const adminCookie = this.adminSessions.get(sessionId);
		return adminCookie?.expires > new Date().getTime();
	}

	async checkPassword(input, storedHash) {
		const hashSalt = "S4kXGx5W5LatEXhk2UGbHBJM";
	
		return await compare(input + hashSalt, storedHash);
	}

	private safeCompare(a: string, b: string): boolean {
		if (!!a && !!b) {
			const aLength = Buffer.byteLength(a);
			const bLength = Buffer.byteLength(b);
			const aBuffer = Buffer.alloc(aLength, 0, 'utf8');
			aBuffer.write(a);
			const bBuffer = Buffer.alloc(aLength, 0, 'utf8');
			bBuffer.write(b);
			return !!(timingSafeEqual(aBuffer, bBuffer) && aLength === bLength);
		}
		return false;
	}
}

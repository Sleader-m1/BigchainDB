/// <reference types="lucia" />

declare namespace Lucia {
    type Auth = import("./auth/lucia").Auth;
    type DatabaseUserAttributes = {
      id: string;
      username: string;
      email: string;
      fio: string;
      phone: string;
      role: "SuperUser";
      createdAt: Date;
      updatedAt: Date;
      organisationId: string | null;
      hash: string;
      salt: string;
      accessToken: string | null;
    };
    type DatabaseSessionAttributes = {};
  }
  
export interface awsEmailSendingBody {
    Action: string, // SendEmail
    Source: string, // Source email
    Destination: {
        ToAddresses: {
                member: {
                    1: string // Email
                }
        }
    },
    Message: {
        Subject: {
            Data: string // Subject
        },
        Body: {
            Html: {
                Data: string // Html
            }
        }
    }
}
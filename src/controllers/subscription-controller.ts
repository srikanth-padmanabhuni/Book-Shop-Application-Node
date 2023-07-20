import { IError, ISubscription, ISuccess } from "../constants/interfaces";
import { Subscription } from "../entities/Subscription";
import { getCustomErrorObj, getCustomSuccessObj, getErrorObj, mapSubscriptionEntityToDto } from "../mappers/mapper";
import { getSubscription, isBookAvailable, isHavingAvailableStock, isSubscriptionAvailable, isUserAvailableNdReader } from "../utilities/helpers";
import { UpdateResult } from "typeorm";
import { updateAvailableStock } from "./book-controller";

export function getSubscriptionById(req: any, res: any) {
    const subscriptionId = req.body?.subscriptionId;
    getSubscription(subscriptionId)
        .then((subscription: Subscription | null) => {
            if(!subscription || subscription == null) {
                const successDto: ISuccess = getCustomSuccessObj(
                    "NO SUBSCRIPTION AVAILABLE",
                    "",
                    200
                )
                return res.json(successDto);
            } else {
                if(subscription.user_id != req.user.userId) {
                    const errorDto: IError = getCustomErrorObj(
                        "UNAUTHORISED USER",
                        "You dont have access to this Subscription",
                        500
                    );
                    return res.json(errorDto);
                }

                const subscriptionDto: ISubscription = mapSubscriptionEntityToDto(subscription);
                return res.json(subscriptionDto);
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}

export function getSubscriptions(req: any, res: any) {
    const subscriptionsEntity = Subscription.createQueryBuilder('subscriptions')
                .select('subscriptions')
                .orderBy('subscriptions.subscribedOn', "DESC")
                .getMany();

    subscriptionsEntity.then((subscriptions: Subscription[]) => {
        if(!subscriptions || subscriptions.length == 0) {
            const successDto: ISuccess = getCustomSuccessObj(
                "NO SUBSCRIPTIONs AVAILABLE",
                "",
                200
            )
            return res.json(successDto);
        } else {
            const subscriptionsDto: ISubscription[] = subscriptions.map((sub: Subscription) => mapSubscriptionEntityToDto(sub));
            return res.json(subscriptionsDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })
}

export function deleteSubscription(req: any, res: any) {
    const subscriptionId = req.body?.subscriptionId;
    getSubscription(subscriptionId)
        .then((subscription: Subscription | null) => {
            if(!subscription || subscription == null) {
                const successDto: ISuccess = getCustomSuccessObj(
                    "NO SUBSCRIPTION AVAILABLE",
                    "No subscription Available to Delete",
                    200
                )
                return res.json(successDto);
            } else {
                
                if(subscription.user_id != req.user.userId) {
                    const errorDto: IError = getCustomErrorObj(
                        "UNAUTHORISED USER",
                        "You dont have access to delete this Subscription",
                        500
                    );
                    return res.json(errorDto);
                }

                subscription.remove().then((subscription: Subscription) => {
                    const successDto: ISuccess = getCustomSuccessObj(
                        "DELETED SUBSCRIPTION",
                        "Subscription deleted Successfully!!!",
                        200
                    )
                    return res.json(successDto);
                }).catch((error: Error) => {
                    console.log(error);
                    const errorDto: IError = getErrorObj(error);
                    return res.json(errorDto);
                })
            }
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}

export function createSubscription(req: any, res: any) {
    const subscription = {
        userId: req.body?.userId,
        bookId: req.body?.bookId,
        validTill: req.body?.validTill
    }

    isUserAvailableNdReader(subscription.userId).then((isUser: boolean) => {
        if(!isUser) {
            const errorDto: IError = getCustomErrorObj(
                "INVALID USER",
                "User is Not Valid to Subscription",
                500
            )
            return res.json(errorDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    isBookAvailable(subscription.bookId).then((isBook: boolean) => {
        if(!isBook) {
            const errorDto: IError = getCustomErrorObj(
                "INVALID BOOK",
                "Book is Not Valid to Subscription",
                500
            )
            return res.json(errorDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    isHavingAvailableStock(subscription.bookId, 1).then((stockAvailable: boolean) => {
        if(!stockAvailable) {
            const errorDto: IError = getCustomErrorObj(
                "INSUGFFICIENT STOCK",
                "No Stock Available for given Book",
                500
            )
            return res.json(errorDto);
        }
    })

    const subscriptionEntity = Subscription.create({
        book_id: subscription.bookId,
        user_id: subscription.userId,
        validTill: subscription.validTill
    });

    subscriptionEntity.save()
        .then((savedSubscription: Subscription) => {
            const subscriptionDto: ISubscription = mapSubscriptionEntityToDto(savedSubscription);
            updateAvailableStock(subscription.bookId, 1);
            return res.json(subscriptionDto);
        })
        .catch((error: Error) => {
            console.log(error);
            const errorDto: IError = getErrorObj(error);
            return res.json(errorDto);
        })
}

export function updateSubscription(req: any, res: any) {
    const subscription = {
        subscriptionId: req.body?.subscriptionId,
        userId: req.body?.userId,
        bookId: req.body?.bookId,
        validTill: req.body?.validTill
    }

    if(subscription.userId != req.user.userId) {
        const errorDto: IError = getCustomErrorObj(
            "UNAUTHORISED USER",
            "You dont have access to update this Subscription",
            500
        );
        return res.json(errorDto);
    }

    isUserAvailableNdReader(subscription.userId).then((isUser: boolean) => {
        if(!isUser) {
            const errorDto: IError = getCustomErrorObj(
                "INVALID USER",
                "User is Not Valid to Subscription",
                500
            )
            return res.json(errorDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    isBookAvailable(subscription.bookId).then((isBook: boolean) => {
        if(!isBook) {
            const errorDto: IError = getCustomErrorObj(
                "INVALID BOOK",
                "Book is Not Valid to Subscription",
                500
            )
            return res.json(errorDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    isSubscriptionAvailable(subscription.subscriptionId).then((isSubscription: boolean) => {
        if(!isSubscription) {
            const errorDto: IError = getCustomErrorObj(
                "INVALID SUBSCRPTION",
                "Subscription with given Id is not Valid",
                500
            )
            return res.json(errorDto);
        }
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })

    Subscription.update({id: subscription.subscriptionId}, {
        book_id: subscription.bookId,
        user_id: subscription.userId,
        validTill: subscription.validTill
    }).then((updatedSubscription: UpdateResult) => {
        return res.json(updatedSubscription);
    })
    .catch((error: Error) => {
        console.log(error);
        const errorDto: IError = getErrorObj(error);
        return res.json(errorDto);
    })
}
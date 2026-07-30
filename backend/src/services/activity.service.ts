import Activity from "../models/activity.model";


interface ActivityData {
    user: string;
    action: string;
    module: string;
    description: string;
}


export const createActivity = async (
    data: ActivityData
) => {

    try {

        const activity = await Activity.create({
            user: data.user,
            action: data.action,
            module: data.module,
            description: data.description
        });


        return activity;


    } catch (error) {

        console.log(
            "Activity Creation Error:",
            error
        );

    }

};
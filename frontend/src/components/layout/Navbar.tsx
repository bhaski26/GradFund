import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";

export default function Navbar() {

    return (

        <header className="flex h-20 items-center justify-between border-b bg-white px-8">

            <div>

                <h2 className="text-2xl font-bold">

                    Dashboard

                </h2>

            </div>

            <div className="flex items-center gap-3">

                <NotificationBell />

                <ProfileDropdown />

            </div>

        </header>

    );

}
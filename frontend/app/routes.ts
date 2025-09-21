import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "./components/MainLayout/MainLayout.tsx", [
    route("/about", "./pages/About.tsx"),
    route("/images", "./pages/GetImages.tsx"),
    route("/imageList", "./pages/Images.tsx"),
    route("/newImage", "./pages/NewImage.tsx"),
    route("/editImage", "./pages/EditImage.tsx"),
    route("/favoriteList", "./pages/Favorites.tsx"),
    route("/newFavorite", "./pages/NewFavorite.tsx"),
    route("/editFavorite", "./pages/EditFavorite.tsx"),
    route("/presentFavorite", "./pages/PresentFavorite.tsx"),

    // * matches all URLs, the ? makes it optional so it will match / as well
    route("*?", "./catchall.tsx"),
  ]),
] satisfies RouteConfig;

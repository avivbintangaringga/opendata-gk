import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import DatasetsView from '../views/dataset/DatasetsView.vue'
import DatasetDetails from '../views/dataset/DatasetDetails.vue'
import OrganizationsView from '../views/organization/OrganizationsView.vue'
import OrganizationDetails from '../views/organization/OrganizationDetails.vue'
import GroupsView from '../views/group/GroupsView.vue'
import GroupDetails from '../views/group/GroupDetails.vue'
import AboutView from '../views/about/AboutView.vue'
import { ckanApi } from '../api/ckan-api'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }, {
    path: '/datasets',
    name: 'datasets',
    component: DatasetsView
  },
  {
    path: '/dataset/:id',
    name: 'dataset-details',
    component: DatasetDetails
  }, {
    path: '/organizations',
    name: 'organizations',
    component: OrganizationsView
  },  {
    path: '/organization/:id',
    name: 'organization-details',
    component: OrganizationDetails
  }, {
    path: '/groups',
    name: 'groups',
    component: GroupsView
  },  {
    path: '/group/:id',
    name: 'group-details',
    component: GroupDetails
  }, {
    path: '/about',
    name: 'about',
    component: AboutView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth'
    }
  },
})

export default router

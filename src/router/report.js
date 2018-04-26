export default [

  /**
   * @param query.index
   */
  {
    path: '/report',
    component: () => import('../page/report/index')
  },
  /**
   * @param query.index
   */
  {
    path: '/report/type',
    component: () => import('../page/report/type')
  },
  /**
   * @param query.index
   * @param query.compatId
   * @param query.patCard
   * @param cache.compatCache
   */
  {
    path: '/report/list',
    component: () => import('../page/report/list')
  },

  /**
   * @param cache.compatCache
   * @param cache.examinationCache
   */
  {
    path: '/report/detail/examination',
    component: () => import('../page/report/detail/examination')
  },
  /**
   * @param cache.compatCache
   * @param cache.inspectCache
   */
  {
    path: '/report/detail/inspect',
    component: () => import('../page/report/detail/inspect')
  },

  {
    path: '/report/detail/test',
    component: () => import('../page/report/detail/test')
  }


]

import type { GameConfig } from '@/types/game'

/**
 * 游戏默认配置
 */
export const DEFAULT_CONFIG: GameConfig = {
  initialSceneId: 'start',
  initialAttributes: {
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5
  },
  scenes: {
    start: {
      id: 'start',
      description:
        '你在一片荒芜的废土中醒来。四周是断壁残垣，天空被厚厚的尘埃笼罩。你记不清自己是怎样来到这里的，只记得名字叫"火种"——这是母亲临终前给你的名字。\n\n远处的废墟中似乎有什么东西在闪烁...',
      choices: [
        {
          id: 'explore',
          text: '前往废墟探索',
          nextSceneId: 'ruins'
        },
        {
          id: 'rest',
          text: '原地休息，恢复体力',
          nextSceneId: 'rest'
        }
      ]
    },
    ruins: {
      id: 'ruins',
      description:
        '你小心翼翼地穿过废墟。那闪烁的光芒来自一个完好的终端机，屏幕上显示着一串神秘的代码。旁边还有一把生锈的武器和几瓶浑浊的水。',
      choices: [
        {
          id: 'take_weapon',
          text: '拿起武器',
          nextSceneId: 'take_weapon'
        },
        {
          id: 'use_terminal',
          text: '使用终端机',
          nextSceneId: 'terminal'
        },
        {
          id: 'back',
          text: '返回',
          nextSceneId: 'start'
        }
      ]
    },
    rest: {
      id: 'rest',
      description: '你找了个避风的角落，蜷缩着睡了一会儿。醒来时感觉体力恢复了一些，但肚子开始咕咕叫了。',
      choices: [
        {
          id: 'ruins',
          text: '前往废墟',
          nextSceneId: 'ruins'
        }
      ]
    },
    take_weapon: {
      id: 'take_weapon',
      description: '你拿起生锈的武器。虽然老旧，但总比赤手空拳强。获得：旧钢刀（攻击力+5）',
      choices: [
        {
          id: 'explore_more',
          text: '继续探索',
          nextSceneId: 'ruins_explored'
        }
      ]
    },
    terminal: {
      id: 'terminal',
      description:
        '终端机的屏幕亮起，显示出一幅地图，标记着一个名为"伊甸园"的地方。这可能是这片废土上最后的避难所。',
      choices: [
        {
          id: 'memorize',
          text: '记住位置',
          nextSceneId: 'map_memorized'
        }
      ]
    },
    ruins_explored: {
      id: 'ruins_explored',
      description: '你继续深入废墟，发现了一辆还能启动的旧摩托车。燃料不多，但足以让你走得更远。',
      choices: [
        {
          id: 'ride',
          text: '骑上摩托车出发',
          nextSceneId: 'journey_begin'
        }
      ]
    },
    map_memorized: {
      id: 'map_memorized',
      description: '你记下了"伊甸园"的方位。这将是一段漫长的旅程，但也是生存的希望。',
      choices: [
        {
          id: 'start_journey',
          text: '开始旅程',
          nextSceneId: 'journey_begin'
        }
      ]
    },
    journey_begin: {
      id: 'journey_begin',
      description:
        '【第一章 完】\n\n你踏上了前往伊甸园的旅程。前路凶险未卜，但作为"火种"，你必须活下去，将文明的希望传递下去...\n\n（待续）',
      choices: [
        {
          id: 'restart',
          text: '重新开始',
          nextSceneId: 'start'
        }
      ]
    }
  }
}

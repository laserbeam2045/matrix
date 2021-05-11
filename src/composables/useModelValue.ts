import { PropType, ComputedRef, computed, useContext } from 'vue'

interface Props {
  [key: string]: PropType<any>;
}

/**
 * propsの特定の値を代入可能なrefオブジェクトにする
 * @param {Props} props setupメソッドの第一引数
 * @param {string} name propsのプロパティ名
 * @return {ComputedRef}
 */
export default function useModelValue(props: Props, name: string): ComputedRef {
  const { emit } = useContext()

  return computed({
    get: () => props[name],
    set: value => emit(`update:${name}`, value),
  })
}
